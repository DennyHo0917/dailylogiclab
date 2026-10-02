import { paymentResponse, PAYMENT_PROJECT } from "./payment-analytics.mjs";

export async function validStripeSignature(raw, header, secret, now = Date.now()) {
  if (!secret || !header) return false;
  const parts = header.split(",").map(part => part.trim().split("="));
  const timestamps = parts.filter(([key]) => key === "t");
  if (timestamps.length !== 1 || !/^\d{10,12}$/.test(timestamps[0][1])) return false;
  const timestamp = timestamps[0][1];
  if (Math.abs(now / 1000 - Number(timestamp)) > 300) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const digest = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${raw}`)));
  for (const [type, value] of parts) {
    if (type !== "v1" || !/^[a-f0-9]{64}$/i.test(value || "")) continue;
    const received = new Uint8Array(value.match(/../g).map(byte => parseInt(byte, 16)));
    let difference = 0;
    for (let i = 0; i < digest.length; i++) difference |= digest[i] ^ received[i];
    if (difference === 0) return true;
  }
  return false;
}

export async function handleStripeWebhook(request, env) {
  if (request.method !== "POST") return paymentResponse({ error: "method_not_allowed" }, 405);
  if (!env.STRIPE_WEBHOOK_SECRET || !env.PAYMENT_ANALYTICS) return paymentResponse({ error: "reporting_unavailable" }, 503);
  try {
    if (Number(request.headers.get("Content-Length")) > 262144) return paymentResponse({ error: "invalid_request" }, 413);
    const raw = await request.text();
    if (new TextEncoder().encode(raw).length > 262144) return paymentResponse({ error: "invalid_request" }, 413);
    if (!await validStripeSignature(raw, request.headers.get("Stripe-Signature"), env.STRIPE_WEBHOOK_SECRET)) return paymentResponse({ error: "invalid_signature" }, 400);
    let event;
    try { event = JSON.parse(raw); } catch { return paymentResponse({ error: "invalid_request" }, 400); }
    if (!/^evt_[A-Za-z0-9]+$/.test(event.id || "") || !Number.isInteger(event.created)) return paymentResponse({ error: "invalid_request" }, 400);
    const session = event.data?.object;
    const live = env.STRIPE_LIVEMODE !== "false";
    if (event.livemode !== live || !["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type) || session?.metadata?.project !== PAYMENT_PROJECT || session?.payment_status !== "paid") return paymentResponse({ status: "ignored" });
    if (!/^cs_(live|test)_[A-Za-z0-9]+$/.test(session.id || "")) return paymentResponse({ error: "invalid_request" }, 400);
    const id = env.PAYMENT_ANALYTICS.idFromName(session.id);
    const response = await env.PAYMENT_ANALYTICS.get(id).fetch(new Request("https://payment-analytics.internal/", {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sessionId: session.id })
    }));
    if (!response.ok) throw new Error("Payment reporting failed");
    return paymentResponse({ received: true });
  } catch {
    // Non-2xx makes Stripe retry. Never log payloads, credentials or buyer data.
    return paymentResponse({ error: "reporting_unavailable" }, 503);
  }
}
