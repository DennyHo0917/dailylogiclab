import { createTipCheckout } from "./stripe-checkout.mjs";
import { handleStripeWebhook } from "./stripe-webhook.mjs";
export { PaymentAnalytics } from "./payment-analytics.mjs";

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/api/support/checkout") return createTipCheckout(request, env);
    if (pathname === "/api/support/stripe-webhook") return handleStripeWebhook(request, env);
    if (pathname.startsWith("/api/support/")) return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" } });
    return env.ASSETS.fetch(request);
  }
};
