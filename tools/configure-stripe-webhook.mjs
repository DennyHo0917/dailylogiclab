import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PAYMENT_PROJECT } from "../server/payment-analytics.mjs";

// Store secrets only outside the public repository. Never print Stripe responses.
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const privateFile = path.resolve(process.argv[2] || "");
const relative = path.relative(root, privateFile);
if (!process.argv[2] || !relative || (!relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))) throw new Error("Pass an existing private env file outside the repository.");
const source = fs.readFileSync(privateFile, "utf8");
const key = process.env.STRIPE_SECRET_KEY;
const expectedAccount = process.env.STRIPE_ACCOUNT_ID;
if (!key || !/^acct_[A-Za-z0-9]+$/.test(expectedAccount || "")) throw new Error("Load the dedicated Stripe account configuration with --env-file.");
const url = "https://dailylogiclab.com/api/support/stripe-webhook";
const events = ["checkout.session.completed", "checkout.session.async_payment_succeeded"];
async function stripe(route, fields) {
  const headers = { Authorization: `Bearer ${key}` };
  const options = { headers, signal: AbortSignal.timeout(20000) };
  if (fields) {
    options.method = "POST";
    headers["Content-Type"] = "application/x-www-form-urlencoded";
    headers["Idempotency-Key"] = `${PAYMENT_PROJECT}-ga4-webhook-v1`;
    options.body = new URLSearchParams(fields).toString();
  }
  const response = await fetch(`https://api.stripe.com/v1/${route}`, options);
  if (!response.ok) throw new Error(`Stripe configuration HTTP ${response.status}; private response omitted.`);
  return response.json();
}
const account = await stripe("account");
if (account.id !== expectedAccount) throw new Error("Stripe account mismatch; no changes made.");
let endpoint;
let cursor = "";
do {
  const page = await stripe(`webhook_endpoints?limit=100${cursor ? `&starting_after=${cursor}` : ""}`);
  endpoint = page.data.find(item => item.url === url);
  if (endpoint) break;
  cursor = page.has_more ? page.data.at(-1)?.id : "";
} while (cursor);
if (endpoint && (!process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_ENDPOINT_ID !== endpoint.id)) throw new Error("Existing webhook found; save its matching signing secret and STRIPE_WEBHOOK_ENDPOINT_ID privately before retrying.");
if (!endpoint) {
  endpoint = await stripe("webhook_endpoints", {
    url, description: "Daily Logic Lab: verified card payments to GA4",
    "enabled_events[0]": events[0], "enabled_events[1]": events[1],
    "metadata[project]": PAYMENT_PROJECT
  });
  if (!/^whsec_[A-Za-z0-9]+$/.test(endpoint.secret || "")) throw new Error("Webhook created without a usable signing secret; retrieve it in Stripe Dashboard.");
  let updated = source;
  for (const [name, value] of Object.entries({ STRIPE_WEBHOOK_SECRET: endpoint.secret, STRIPE_WEBHOOK_ENDPOINT_ID: endpoint.id })) {
    const line = new RegExp(`^${name}=.*$`, "m");
    updated = line.test(updated) ? updated.replace(line, `${name}=${value}`) : `${updated.trimEnd()}\n${name}=${value}\n`;
  }
  fs.writeFileSync(privateFile, updated, { mode: 0o600 });
}
if (endpoint.status !== "enabled" || !events.every(event => endpoint.enabled_events.includes(event))) throw new Error("Webhook is disabled or missing required events; update it in Stripe Dashboard.");
console.log(JSON.stringify({ account: account.id, endpoint: endpoint.id, url: endpoint.url, events: endpoint.enabled_events, status: endpoint.status, signingSecretSavedPrivately: true }));
