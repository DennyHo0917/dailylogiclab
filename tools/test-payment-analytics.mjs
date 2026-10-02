import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { handleStripeWebhook, validStripeSignature } from "../server/stripe-webhook.mjs";
import { buildPurchase, PaymentAnalytics, PAYMENT_PROJECT, reportPaidCheckout } from "../server/payment-analytics.mjs";

const env = { STRIPE_SECRET_KEY: "private-stripe-fixture", STRIPE_WEBHOOK_SECRET: "private-webhook-fixture", STRIPE_ACCOUNT_ID: "acct_fixture", STRIPE_PRICE_ID: "price_fixture", GA4_MEASUREMENT_ID: "G-FIXTURE", GA4_API_SECRET: "private-ga4-fixture" };
const session = {
  id: "cs_live_fixture", livemode: true, mode: "payment", status: "complete", payment_status: "paid", amount_total: 700, currency: "usd",
  metadata: { project: PAYMENT_PROJECT, ga_client_id: "12345.67890", ga_session_id: "1790880000", ga_language: "zh-cn", ga_entry_point: "footer" },
  customer_details: { email: "private@example.invalid", name: "Private Customer" },
  line_items: { has_more: false, data: [{ quantity: 7, price: { id: env.STRIPE_PRICE_ID, unit_amount: 100, currency: "usd" } }] }
};
function remote(options = {}) {
  const calls = [];
  const fetchRemote = async (url, request = {}) => {
    calls.push({ url, request });
    if (url.endsWith("/account")) return Response.json({ id: options.account || env.STRIPE_ACCOUNT_ID });
    if (url.includes("/checkout/sessions/")) return Response.json(options.session || session);
    assert.equal(new URL(url).hostname, "www.google-analytics.com");
    assert.equal(new URL(url).pathname, "/mp/collect");
    if (options.analyticsFail) return new Response(null, { status: 503 });
    return new Response(null, { status: 204 });
  };
  return { calls, fetchRemote };
}
function event(overrides = {}) {
  return { id: "evt_fixture", type: "checkout.session.completed", livemode: true, created: Math.floor(Date.now() / 1000), data: { object: session }, ...overrides };
}
function signedRequest(data = event(), options = {}) {
  const raw = JSON.stringify(data);
  const timestamp = options.timestamp ?? Math.floor(Date.now() / 1000);
  const signature = createHmac("sha256", options.secret || env.STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${raw}`).digest("hex");
  return new Request("https://dailylogiclab.com/api/support/stripe-webhook", { method: "POST", headers: { "Stripe-Signature": `t=${timestamp},v1=${signature}` }, body: raw });
}
let count = 0;
async function check(name, task) { await task(); console.log(`PASS ${name}`); count++; }

await check("signed webhooks only: raw-body tampering, stale replay and wrong secrets fail", async () => {
  const request = signedRequest();
  const raw = await request.text();
  assert.equal(await validStripeSignature(raw, request.headers.get("Stripe-Signature"), env.STRIPE_WEBHOOK_SECRET), true);
  assert.equal(await validStripeSignature(raw + " ", request.headers.get("Stripe-Signature"), env.STRIPE_WEBHOOK_SECRET), false);
  assert.equal(await validStripeSignature(raw, request.headers.get("Stripe-Signature"), "wrong"), false);
  const old = signedRequest(event(), { timestamp: Math.floor(Date.now() / 1000) - 301 });
  assert.equal(await validStripeSignature(await old.text(), old.headers.get("Stripe-Signature"), env.STRIPE_WEBHOOK_SECRET), false);
});

await check("unsigned requests, irrelevant events, test events and unpaid sessions do not report", async () => {
  let forwarded = 0;
  const binding = { idFromName: value => value, get: () => ({ fetch: async () => { forwarded++; return Response.json({ status: "submitted" }); } }) };
  const settings = { ...env, PAYMENT_ANALYTICS: binding };
  const unsigned = new Request("https://dailylogiclab.com/api/support/stripe-webhook", { method: "POST", body: "{}" });
  assert.equal((await handleStripeWebhook(unsigned, settings)).status, 400);
  for (const data of [event({ type: "charge.succeeded" }), event({ livemode: false }), event({ data: { object: { ...session, payment_status: "unpaid" } } }), event({ data: { object: { ...session, metadata: { project: "other-site" } } } })]) {
    assert.deepEqual(await (await handleStripeWebhook(signedRequest(data), settings)).json(), { status: "ignored" });
  }
  assert.equal(forwarded, 0);
  assert.equal((await handleStripeWebhook(signedRequest(), settings)).status, 200);
  assert.equal((await handleStripeWebhook(signedRequest(event({ type: "checkout.session.async_payment_succeeded" })), settings)).status, 200);
  assert.equal(forwarded, 2);
});

await check("the server rechecks the real Stripe session, price and amount before reporting", async () => {
  for (const changed of [{ payment_status: "unpaid" }, { livemode: false }, { metadata: { project: "other" } }, { mode: "subscription" }]) {
    const stub = remote({ session: { ...session, ...changed } });
    assert.deepEqual(await reportPaidCheckout(session.id, env, stub.fetchRemote), { status: "ignored" });
    assert.equal(stub.calls.some(call => call.url.includes("/mp/")), false);
  }
  for (const changed of [{ amount_total: 500 }, { currency: "eur" }, { amount_total: 750 }, { line_items: { data: [{ quantity: 7, price: { id: "price_other", unit_amount: 100, currency: "usd" } }] } }]) {
    const stub = remote({ session: { ...session, ...changed } });
    await assert.rejects(reportPaidCheckout(session.id, env, stub.fetchRemote));
    assert.equal(stub.calls.some(call => call.url.includes("/mp/")), false);
  }
  const wrong = remote({ account: "acct_other" });
  await assert.rejects(reportPaidCheckout(session.id, env, wrong.fetchRemote));
});

await check("a verified US$7 payment creates a standard purchase with no buyer data", async () => {
  const stub = remote();
  assert.equal((await reportPaidCheckout(session.id, env, stub.fetchRemote)).status, "submitted");
  const call = stub.calls.at(-1);
  const payload = JSON.parse(call.request.body);
  const purchase = payload.events[0];
  assert.equal(purchase.name, "purchase");
  assert.equal(purchase.params.value, 7);
  assert.equal(purchase.params.currency, "USD");
  assert.equal(purchase.params.items[0].quantity, 7);
  assert.equal(purchase.params.items[0].price, 1);
  assert.equal(payload.client_id, session.metadata.ga_client_id);
  assert.equal(purchase.params.session_id, Number(session.metadata.ga_session_id));
  assert.ok(purchase.params.engagement_time_msec > 0);
  assert.equal(call.request.body.includes(session.customer_details.email), false);
  assert.equal(call.request.body.includes(session.customer_details.name), false);
  assert.equal(call.request.body.includes(session.id), false);
  assert.equal(new URL(call.url).searchParams.get("api_secret"), env.GA4_API_SECRET);
  const anonymous = await buildPurchase({ ...session, metadata: {} });
  assert.match(anonymous.client_id, /^\d+\.\d+$/);
  assert.equal(anonymous.events[0].params.attribution_source, "unattributed");
  assert.equal(anonymous.events[0].params.transaction_id, purchase.params.transaction_id);
  const invalid = await buildPurchase({ ...session, metadata: { ga_client_id: "invalid.id", ga_session_id: "0" } });
  assert.equal(invalid.client_id, anonymous.client_id);
  assert.equal(invalid.events[0].params.attribution_source, "unattributed");
  assert.ok(invalid.events[0].params.session_id > 0);
});

await check("concurrent callbacks and a new object instance cannot count one payment twice", async () => {
  const stored = new Map();
  const state = { storage: { get: async key => stored.get(key), put: async (key, value) => stored.set(key, value) } };
  const stub = remote();
  const object = new PaymentAnalytics(state, env, stub.fetchRemote);
  const request = () => new Request("https://internal/", { method: "POST", body: JSON.stringify({ sessionId: session.id }) });
  await Promise.all([object.fetch(request()), object.fetch(request()), object.fetch(request())]);
  const restarted = new PaymentAnalytics(state, env, stub.fetchRemote);
  assert.deepEqual(await (await restarted.fetch(request())).json(), { status: "duplicate" });
  assert.equal(stub.calls.filter(call => call.url.includes("/mp/")).length, 1);
});

await check("analytics failures remain retryable instead of being marked delivered", async () => {
  const stored = new Map();
  const state = { storage: { get: async key => stored.get(key), put: async (key, value) => stored.set(key, value) } };
  const failed = remote({ analyticsFail: true });
  const object = new PaymentAnalytics(state, env, failed.fetchRemote);
  const request = () => new Request("https://internal/", { method: "POST", body: JSON.stringify({ sessionId: session.id }) });
  await assert.rejects(object.fetch(request()));
  assert.equal(stored.has("delivery"), false);
  const recovered = remote();
  const retry = new PaymentAnalytics(state, env, recovered.fetchRemote);
  assert.equal((await (await retry.fetch(request())).json()).status, "submitted");
  const binding = { idFromName: value => value, get: () => ({ fetch: async () => { throw new Error("private failure"); } }) };
  const response = await handleStripeWebhook(signedRequest(), { ...env, PAYMENT_ANALYTICS: binding });
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { error: "reporting_unavailable" });
});
console.log(`${count} payment analytics checks passed. No actual payments or analytics events were sent.`);
