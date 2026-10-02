const locales = { en: "en", de: "de", es: "es", fr: "fr", ja: "ja", "pt-br": "pt-BR", "zh-cn": "zh" };
let verifiedConfig;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } });
}

export async function createTipCheckout(request, env, fetchStripe = fetch) {
  const origin = new URL(request.url).origin;
  if (request.method !== "POST") return json({ error: "method_not_allowed" }, 405);
  if (request.headers.get("Origin") !== origin) return json({ error: "invalid_origin" }, 403);
  if (!request.headers.get("Content-Type")?.startsWith("application/json")) return json({ error: "invalid_request" }, 415);
  let body;
  try {
    if (Number(request.headers.get("Content-Length")) > 2048) return json({ error: "invalid_request" }, 413);
    const text = await request.text();
    if (text.length > 2048) return json({ error: "invalid_request" }, 413);
    body = JSON.parse(text);
  } catch { return json({ error: "invalid_request" }, 400); }
  if (!body || !Number.isInteger(body.amount) || body.amount < 1 || body.amount > 1000) return json({ error: "invalid_amount" }, 400);
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(body.requestId || "")) return json({ error: "invalid_request" }, 400);
  if (!env.STRIPE_SECRET_KEY || !/^acct_[a-zA-Z0-9]+$/.test(env.STRIPE_ACCOUNT_ID || "") || !/^price_[a-zA-Z0-9]+$/.test(env.STRIPE_PRICE_ID || "")) {
    return json({ error: "payment_unavailable" }, 503);
  }
  const language = Object.hasOwn(locales, body.language) ? body.language : "en";
  const base = env.SITE_ORIGIN || "https://dailylogiclab.com";
  let returnUrl;
  try {
    returnUrl = new URL(body.returnPath || (language === "en" ? "/" : `/${language}/`), base);
    if (returnUrl.origin !== new URL(base).origin) return json({ error: "invalid_request" }, 400);
    returnUrl.search = "";
    returnUrl.hash = "";
  } catch { return json({ error: "invalid_request" }, 400); }

  async function stripe(route, fields) {
    const headers = { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}` };
    const options = { headers, signal: AbortSignal.timeout(15000) };
    if (fields) {
      options.method = "POST";
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      headers["Idempotency-Key"] = `dailylogiclab-tip-${body.requestId}`;
      options.body = new URLSearchParams(fields).toString();
    }
    const response = await fetchStripe(`https://api.stripe.com/v1/${route}`, options);
    if (!response.ok) throw new Error("Stripe request failed");
    return response.json();
  }

  try {
    // Cache only verification, never a user's Checkout Session or personal data.
    const identity = `${env.STRIPE_ACCOUNT_ID}:${env.STRIPE_PRICE_ID}`;
    if (verifiedConfig?.key !== env.STRIPE_SECRET_KEY || verifiedConfig?.identity !== identity || verifiedConfig.expires < Date.now() || verifiedConfig.fetchStripe !== fetchStripe) {
      const account = await stripe("account");
      if (account.id !== env.STRIPE_ACCOUNT_ID || !account.charges_enabled) throw new Error("Wrong or inactive account");
      const price = await stripe(`prices/${env.STRIPE_PRICE_ID}?expand[]=product`);
      if (!price.active || price.currency !== "usd" || price.type !== "one_time" || price.unit_amount !== 100 || price.custom_unit_amount || !price.product?.active || price.product?.metadata?.purpose !== "tips_for_provided_puzzle_content") {
        throw new Error("Invalid content-tip price");
      }
      verifiedConfig = { key: env.STRIPE_SECRET_KEY, identity, expires: Date.now() + 300000, fetchStripe };
    }
    const session = await stripe("checkout/sessions", {
      mode: "payment",
      "line_items[0][price]": env.STRIPE_PRICE_ID,
      "line_items[0][quantity]": String(body.amount),
      "payment_method_types[0]": "card",
      locale: locales[language],
      success_url: returnUrl.href,
      cancel_url: returnUrl.href,
      "metadata[project]": "dailylogiclab-content-tips-v1",
      "payment_intent_data[description]": "Daily Logic Lab — optional tip for puzzle content already provided",
      "payment_intent_data[metadata][purpose]": "tips_for_provided_puzzle_content"
    });
    const checkoutUrl = new URL(session.url);
    if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com" || checkoutUrl.username || checkoutUrl.password || session.amount_total !== body.amount * 100 || session.currency !== "usd") throw new Error("Unexpected Checkout Session");
    return json({ url: checkoutUrl.href });
  } catch {
    // The browser must never receive Stripe credentials, request headers, or errors.
    return json({ error: "payment_unavailable" }, 503);
  }
}
