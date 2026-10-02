export const PAYMENT_PROJECT = "dailylogiclab-content-tips-v1";

export function paymentResponse(body, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}

export async function buildPurchase(session, now = Date.now()) {
  const hash = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`dailylogiclab:${session.id}`)));
  const reference = [...hash].map(byte => byte.toString(16).padStart(2, "0")).join("").slice(0, 32);
  const metadata = session.metadata || {};
  const browserClientId = /^\d{1,20}\.\d{1,20}$/.test(metadata.ga_client_id || "");
  // Numeric halves satisfy GA4's web client_id format without inventing a visitor.
  const clientId = browserClientId ? metadata.ga_client_id : `${parseInt(reference.slice(0, 12), 16)}.${parseInt(reference.slice(12, 24), 16)}`;
  const sessionId = /^\d{1,15}$/.test(metadata.ga_session_id || "") && Number(metadata.ga_session_id) > 0 ? Number(metadata.ga_session_id) : Math.floor(now / 1000);
  return {
    client_id: clientId,
    // This contains no name, email, wallet address or raw Stripe session ID.
    events: [{ name: "purchase", params: {
      transaction_id: `dll_${reference}`, currency: "USD", value: session.amount_total / 100,
      session_id: sessionId, engagement_time_msec: 1,
      payment_method: "card", payment_confirmation: "stripe_webhook",
      language: metadata.ga_language || "en",
      entry_point: ["footer", "completion"].includes(metadata.ga_entry_point) ? metadata.ga_entry_point : "unknown",
      attribution_source: browserClientId ? "browser" : "unattributed",
      items: [{ item_id: "dailylogiclab_content_tip", item_name: "Daily Logic Lab puzzle content tip", price: 1, quantity: session.amount_total / 100 }]
    } }]
  };
}

export async function reportPaidCheckout(sessionId, env, fetchRemote = fetch) {
  if (!env.STRIPE_SECRET_KEY || !env.GA4_API_SECRET || !/^G-[A-Z0-9]+$/.test(env.GA4_MEASUREMENT_ID || "") || !env.STRIPE_ACCOUNT_ID || !env.STRIPE_PRICE_ID) throw new Error("Payment reporting unavailable");
  async function stripe(route) {
    const response = await fetchRemote(`https://api.stripe.com/v1/${route}`, {
      headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` }, signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) throw new Error("Payment verification unavailable");
    return response.json();
  }
  const account = await stripe("account");
  if (account.id !== env.STRIPE_ACCOUNT_ID) throw new Error("Payment account mismatch");
  const session = await stripe(`checkout/sessions/${sessionId}?expand[]=line_items`);
  const live = env.STRIPE_LIVEMODE !== "false";
  const item = session.line_items?.data?.[0];
  if (session.id !== sessionId || session.livemode !== live || session.metadata?.project !== PAYMENT_PROJECT || session.mode !== "payment" || session.payment_status !== "paid" || session.status !== "complete") return { status: "ignored" };
  if (session.currency !== "usd" || !Number.isInteger(session.amount_total) || session.amount_total < 100 || session.amount_total > 100000 || session.amount_total % 100 || session.line_items?.has_more || session.line_items?.data?.length !== 1 || item?.price?.id !== env.STRIPE_PRICE_ID || item.price.unit_amount !== 100 || item.price.currency !== "usd" || item.quantity * 100 !== session.amount_total) throw new Error("Unexpected payment amount or product");
  const payload = await buildPurchase(session);
  const endpoint = new URL("https://www.google-analytics.com/mp/collect");
  endpoint.searchParams.set("measurement_id", env.GA4_MEASUREMENT_ID);
  endpoint.searchParams.set("api_secret", env.GA4_API_SECRET);
  const response = await fetchRemote(endpoint.href, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), signal: AbortSignal.timeout(8000)
  });
  if (!response.ok) throw new Error("Analytics reporting unavailable");
  // A 2xx acknowledges transport, not visibility in GA4 reports.
  return { status: "submitted", transactionId: payload.events[0].params.transaction_id };
}

// One durable object per Checkout Session serializes concurrent Stripe retries.
// GA4's stable transaction_id also protects the acceptance/storage crash window.
export class PaymentAnalytics {
  constructor(state, env, fetchRemote = fetch) { this.state = state; this.env = env; this.fetchRemote = fetchRemote; this.inFlight = null; }
  async fetch(request) {
    if (request.method !== "POST") return paymentResponse({ error: "method_not_allowed" }, 405);
    let body;
    try { body = await request.json(); } catch { return paymentResponse({ error: "invalid_request" }, 400); }
    if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(body?.sessionId || "")) return paymentResponse({ error: "invalid_request" }, 400);
    // Assignment happens before yielding; concurrent requests share this promise.
    if (!this.inFlight) {
      this.inFlight = this.deliver(body.sessionId).finally(() => { this.inFlight = null; });
    }
    return paymentResponse(await this.inFlight);
  }
  async deliver(sessionId) {
    const previous = await this.state.storage.get("delivery");
    if (previous?.status === "submitted") return { status: "duplicate" };
    const result = await reportPaidCheckout(sessionId, this.env, this.fetchRemote);
    if (result.status === "submitted") await this.state.storage.put("delivery", { ...result, submittedAt: Date.now() });
    return { status: result.status };
  }
}
