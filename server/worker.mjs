import { createTipCheckout } from "./stripe-checkout.mjs";

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname;
    if (pathname === "/api/support/checkout") return createTipCheckout(request, env);
    if (pathname.startsWith("/api/support/")) return new Response("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex, nofollow", "Cache-Control": "no-store" } });
    return env.ASSETS.fetch(request);
  }
};
