import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Run locally with a private --env-file outside this static site's root.
// The expected account ID prevents accidentally provisioning API Route's account.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const key = process.env.STRIPE_SECRET_KEY;
const expectedAccount = process.env.STRIPE_ACCOUNT_ID;
if (!key || !/^acct_[a-zA-Z0-9]+$/.test(expectedAccount || "")) {
  throw new Error("Set STRIPE_SECRET_KEY and STRIPE_ACCOUNT_ID for the Daily Logic Lab account.");
}

async function stripe(route, fields, idempotency) {
  const headers = { Authorization: `Bearer ${key}` };
  const options = { headers, signal: AbortSignal.timeout(30000) };
  if (fields) {
    options.method = "POST";
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    headers["Idempotency-Key"] = idempotency;
    options.body = new URLSearchParams(fields).toString();
  }
  const response = await fetch(`https://api.stripe.com/v1/${route}`, options);
  const result = await response.json();
  if (!response.ok) {
    // Don't log request headers, credentials, or the complete account response.
    const message = String(result.error?.message || "Request failed").replace(/(?:sk|rk|whsec)_[a-zA-Z0-9_]+/g, "[redacted]");
    throw new Error(`Stripe ${route.split("?")[0]} HTTP ${response.status}: ${result.error?.code || "request_failed"} (${result.error?.param || "no parameter"}) — ${message}`);
  }
  return result;
}

async function find(route, matches) {
  let cursor = "";
  do {
    const page = await stripe(`${route}${route.includes("?") ? "&" : "?"}limit=100${cursor ? `&starting_after=${cursor}` : ""}`);
    const found = page.data.find(matches);
    if (found) return found;
    cursor = page.has_more ? page.data.at(-1)?.id : "";
  } while (cursor);
}

const account = await stripe("account");
if (account.id !== expectedAccount) throw new Error("Stripe account mismatch; no changes made.");
if (/^sk_live_/.test(key) && !account.charges_enabled) {
  throw new Error("Finish Stripe account activation before configuring live tips.");
}
// Tips acknowledge puzzle content already provided. This flow is not for
// charitable fundraising, personal transfers, or an unfulfilled product.
// https://support.stripe.com/questions/requirements-for-accepting-tips-or-donations
const tag = "dailylogiclab-content-tips-v1";
const product = await find("products?active=true", (item) => item.metadata?.project === tag)
  || await stripe("products", {
    name: "Daily Logic Lab — puzzle content tip",
    description: "Optional, one-time tip for free puzzle content you have already enjoyed. Each unit is US$1; adjust quantity to choose your tip. No subscription or additional paid features.",
    url: "https://dailylogiclab.com/",
    "metadata[purpose]": "tips_for_provided_puzzle_content",
    "metadata[project]": tag
  }, `${tag}-product`);
const price = await find(`prices?active=true&product=${product.id}`, (item) => item.type === "one_time" && item.currency === "usd" && item.unit_amount === 100 && !item.custom_unit_amount)
  || await stripe("prices", {
    product: product.id, currency: "usd", unit_amount: "100",
    "metadata[project]": tag
  }, `${tag}-price`);
const links = [];
for (const amount of [1, 3, 5, 10, 20]) {
const link = await find("payment_links?active=true", (item) => item.metadata?.project === tag && item.metadata?.price === price.id && (item.metadata?.amount === String(amount) || (amount === 5 && !item.metadata?.amount)))
  || await stripe("payment_links", {
    "line_items[0][price]": price.id,
    "line_items[0][quantity]": String(amount),
    "line_items[0][adjustable_quantity][enabled]": "true",
    "line_items[0][adjustable_quantity][minimum]": "1",
    "line_items[0][adjustable_quantity][maximum]": "1000",
    submit_type: "pay",
    "payment_method_types[0]": "card",
    "after_completion[type]": "hosted_confirmation",
    "after_completion[hosted_confirmation][custom_message]": "Thank you for supporting Daily Logic Lab! Keep playing at https://dailylogiclab.com/",
    "payment_intent_data[description]": "Daily Logic Lab — optional tip for puzzle content already provided",
    "payment_intent_data[metadata][purpose]": "tips_for_provided_puzzle_content",
    "payment_intent_data[metadata][project]": tag,
    "metadata[project]": tag,
    "metadata[price]": price.id,
    "metadata[amount]": String(amount)
  }, `${tag}-link-${price.id}-amount-${amount}`);
const url = new URL(link.url);
if (url.protocol !== "https:" || !["buy.stripe.com", "donate.stripe.com"].includes(url.hostname)) {
  throw new Error("Unexpected Stripe Payment Link URL; site config unchanged.");
}
links.push({ amount, url: link.url });
}
const defaultLink = links.find((item) => item.amount === 5);
const configPath = path.join(root, "support-config.js");
const source = fs.readFileSync(configPath, "utf8");
if ((source.match(/stripeUrl:\s*"[^"\r\n]*"/g) || []).length !== 1) throw new Error("Cannot locate stripeUrl in support-config.js.");
const choices = `stripeAmounts: ${JSON.stringify(links, null, 2).replaceAll("\n", "\n  ")},`;
let updated = source.replace(/stripeUrl:\s*"[^"\r\n]*"/, `stripeUrl: ${JSON.stringify(defaultLink.url)}`);
updated = updated.includes("stripeAmounts:")
  ? updated.replace(/stripeAmounts:\s*\[[\s\S]*?\],/, choices)
  : updated.replace(/(stripeUrl:\s*"[^"\r\n]*",)/, `$1\n  ${choices}`);
fs.writeFileSync(configPath, updated);
console.log(JSON.stringify({ account: account.id, product: product.id, price: price.id, links, unitUsd: 1, defaultQuantity: 5, minimumQuantity: 1, maximumQuantity: 1000 }, null, 2));
console.log("Run node tools/version-static-assets.mjs to refresh public asset URLs.");
