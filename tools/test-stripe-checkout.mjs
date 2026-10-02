import assert from "node:assert/strict";
import { createTipCheckout } from "../server/stripe-checkout.mjs";

const origin = "https://dailylogiclab.com";
const env = { STRIPE_SECRET_KEY: "test-private-key", STRIPE_ACCOUNT_ID: "acct_test", STRIPE_PRICE_ID: "price_test", SITE_ORIGIN: origin };
const body = { amount: 7, language: "zh-cn", returnPath: "/zh-cn/nonogram.html?old=1#board", requestId: "00000000-0000-4000-8000-000000000001" };
const account = { id: env.STRIPE_ACCOUNT_ID, charges_enabled: true };
const price = { active: true, currency: "usd", type: "one_time", unit_amount: 100, product: { active: true, metadata: { purpose: "tips_for_provided_puzzle_content" } } };

function request(data = body, headers = {}) {
  return new Request(`${origin}/api/support/checkout`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...headers }, body: JSON.stringify(data) });
}

function fixture(overrides = {}) {
  const calls = [];
  const fetchStripe = async (url, options) => {
    calls.push({ url, options });
    if (overrides.throw) throw new Error(`Upstream exposed ${env.STRIPE_SECRET_KEY}`);
    if (url.endsWith("/account")) return Response.json(overrides.account ?? account);
    if (url.includes("/prices/")) return Response.json(overrides.price ?? price);
    const quantity = Number(new URLSearchParams(options.body).get("line_items[0][quantity]"));
    return Response.json(overrides.session ?? { url: "https://checkout.stripe.com/c/pay/cs_test_fixture", currency: "usd", amount_total: quantity * 100 });
  };
  return { calls, fetchStripe };
}

let checks = 0;
async function check(name, run) {
  await run();
  checks++;
  console.log(`PASS ${name}`);
}

await check("the server uses its fixed price and selected total, with safe localized returns", async () => {
  const stub = fixture();
  const response = await createTipCheckout(request({ ...body, price: "price_attacker" }), env, stub.fetchStripe);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { url: "https://checkout.stripe.com/c/pay/cs_test_fixture" });
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  assert.equal(response.headers.get("X-Robots-Tag"), "noindex, nofollow");
  const session = stub.calls.find(call => call.url.endsWith("/checkout/sessions"));
  const fields = new URLSearchParams(session.options.body);
  assert.equal(fields.get("line_items[0][price]"), env.STRIPE_PRICE_ID);
  assert.equal(fields.get("line_items[0][quantity]"), "7");
  assert.equal(fields.get("mode"), "payment");
  assert.equal(fields.get("locale"), "zh");
  assert.equal(fields.get("success_url"), `${origin}/zh-cn/nonogram.html`);
  assert.equal(fields.get("cancel_url"), `${origin}/zh-cn/nonogram.html`);
  assert.equal(fields.has("line_items[0][adjustable_quantity][enabled]"), false);
  assert.equal(session.options.headers["Idempotency-Key"], `dailylogiclab-tip-${body.requestId}`);
});

await check("both amount boundaries and all seven Checkout locales work", async () => {
  for (const amount of [1, 1000]) {
    const stub = fixture();
    assert.equal((await createTipCheckout(request({ ...body, amount }), env, stub.fetchStripe)).status, 200);
  }
  for (const [language, locale] of Object.entries({ en: "en", de: "de", es: "es", fr: "fr", ja: "ja", "pt-br": "pt-BR", "zh-cn": "zh", unknown: "en" })) {
    const stub = fixture();
    assert.equal((await createTipCheckout(request({ ...body, language }), env, stub.fetchStripe)).status, 200);
    assert.equal(new URLSearchParams(stub.calls.at(-1).options.body).get("locale"), locale);
  }
});

await check("invalid amounts never reach Stripe", async () => {
  for (const amount of [0, -1, 1.5, 1001, "7", null, true, {}, 1e100]) {
    const stub = fixture();
    assert.equal((await createTipCheckout(request({ ...body, amount }), env, stub.fetchStripe)).status, 400);
    assert.equal(stub.calls.length, 0);
  }
});

await check("cross-origin requests, open redirects and malformed requests are rejected", async () => {
  const stub = fixture();
  for (const foreignOrigin of ["https://other.example", "null", ""]) {
    assert.equal((await createTipCheckout(request(body, { Origin: foreignOrigin }), env, stub.fetchStripe)).status, 403);
  }
  for (const returnPath of ["https://other.example", "//other.example/path", "javascript:alert(1)"]) {
    assert.equal((await createTipCheckout(request({ ...body, returnPath }), env, stub.fetchStripe)).status, 400);
  }
  assert.equal((await createTipCheckout(request({ ...body, requestId: "unsafe-key" }), env, stub.fetchStripe)).status, 400);
  assert.equal((await createTipCheckout(request(body, { "Content-Type": "text/plain" }), env, stub.fetchStripe)).status, 415);
  assert.equal((await createTipCheckout(new Request(`${origin}/api/support/checkout`), env, stub.fetchStripe)).status, 405);
  assert.equal((await createTipCheckout(request({ ...body, oversized: "x".repeat(2048) }), env, stub.fetchStripe)).status, 413);
  const broken = new Request(`${origin}/api/support/checkout`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "{" });
  assert.equal((await createTipCheckout(broken, env, stub.fetchStripe)).status, 400);
  assert.equal(stub.calls.length, 0);
});

await check("misconfigured or inactive accounts and prices never create a session", async () => {
  const invalid = [
    { account: { ...account, id: "acct_other" } },
    { account: { ...account, charges_enabled: false } },
    ...[{ active: false }, { currency: "eur" }, { type: "recurring" }, { unit_amount: 500 }, { custom_unit_amount: {} }, { product: { active: false } }, { product: { active: true, metadata: {} } }].map(fields => ({ price: { ...price, ...fields } }))
  ];
  for (const override of invalid) {
    const stub = fixture(override);
    assert.equal((await createTipCheckout(request(), env, stub.fetchStripe)).status, 503);
    assert.equal(stub.calls.some(call => call.url.endsWith("/checkout/sessions")), false);
  }
  const stub = fixture();
  assert.equal((await createTipCheckout(request(), { ...env, STRIPE_SECRET_KEY: "" }, stub.fetchStripe)).status, 503);
  assert.equal(stub.calls.length, 0);
});

await check("unexpected amounts, currencies and redirects cannot reach the client", async () => {
  for (const session of [
    { url: "https://other.example/checkout", currency: "usd", amount_total: 700 },
    { url: "https://checkout.stripe.com/c/pay/test", currency: "usd", amount_total: 500 },
    { url: "https://checkout.stripe.com/c/pay/test", currency: "eur", amount_total: 700 },
    { url: "https://user:pass@checkout.stripe.com/c/pay/test", currency: "usd", amount_total: 700 }
  ]) {
    const stub = fixture({ session });
    const response = await createTipCheckout(request(), env, stub.fetchStripe);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "payment_unavailable" });
  }
  const stub = fixture({ throw: true });
  const response = await createTipCheckout(request(), env, stub.fetchStripe);
  assert.equal(response.status, 503);
  assert.equal((await response.text()).includes(env.STRIPE_SECRET_KEY), false);
});

await check("retries reuse idempotency, but each request gets its own session", async () => {
  const stub = fixture();
  await createTipCheckout(request(), env, stub.fetchStripe);
  await createTipCheckout(request(), env, stub.fetchStripe);
  const sessions = stub.calls.filter(call => call.url.endsWith("/checkout/sessions"));
  assert.equal(sessions.length, 2);
  assert.equal(sessions[0].options.headers["Idempotency-Key"], sessions[1].options.headers["Idempotency-Key"]);
  assert.equal(stub.calls.filter(call => call.url.endsWith("/account")).length, 1);
});

console.log(`${checks} payment checks passed. No network requests or charges were made.`);
