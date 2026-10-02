# Daily Logic Lab

Live website: [Daily Logic Lab](https://dailylogiclab.com/)

Key pages: [Two Not Touch](https://dailylogiclab.com/) | [Tents and Trees](https://dailylogiclab.com/tents-and-trees/) | [Hashi](https://dailylogiclab.com/hashi/) | [Slitherlink](https://dailylogiclab.com/slitherlink/) | [Nonogram](https://dailylogiclab.com/nonogram/) | [Sitemap](https://dailylogiclab.com/sitemap.xml)

Static multilingual logic puzzle site.

## Open Locally

Open `index.html` in a browser.

## Included

- Daily and unlimited Two Not Touch puzzles in 1★ Quick (7×7), 2★ Classic (10×10), and 3★ Expert (14×14) modes
- Daily and unlimited practice Tents and Trees, Hashi, Slitherlink, and Nonogram puzzles
- Full game pages and controls in English, German, Spanish, French, Japanese, Brazilian Portuguese, and Simplified Chinese
- Practice puzzle button
- Deterministic daily seeds and varied practice puzzle generation
- Unique-solution solver checks for Two Not Touch and all four additional game families
- Reset, check, hint, share
- Timer, star count, local streak
- Killer Sudoku combinations calculator with static 2-to-9-cell cage charts
- Responsive layout

## Files

- `index.html`
- `styles.css`
- `app.js`
- `logic-games-core.js`
- `logic-games.js`
- `tools/generate-game-locales.mjs`
- `screenshot-desktop.png`
- `screenshot-mobile.png`

## Local preview

The site is static. Serve the repository root, then open `/` or any game route:

```text
python -m http.server 4173
http://localhost:4173/
```

See [TODO.md](TODO.md) for the staged product plan and remaining upgrades.

Run the full generator, solver, determinism, performance, and diversity check with:

```text
node tools/test-two-not-touch.mjs
node tools/test-logic-games.mjs
```

Run the remaining CI checks with:

```text
node tools/audit-game-seo.mjs
node tools/check-site.mjs
node tools/audit-routes.mjs
```

After changing shared CSS or JavaScript, refresh the content-hashed asset URLs with:

```text
node tools/version-static-assets.mjs
```

This also installs the shared donation entry on all pages with a site footer,
including newly regenerated locale pages. Donation copy covers all seven languages.

## Voluntary donations

The footer opens a crypto donation dialog. A small support prompt also appears
after completing any of the five games and disappears when a new puzzle starts.
The TRON (USDT) and Arbitrum One (USDT/USDC) receiving wallets in
`support-config.js` match API Route's public payment configuration checked on
2026-10-02. These are public addresses, not credentials.

Players choose the network and token, scan or copy the receiving address, and
transfer from their own wallet. The QR encodes only the address; the player enters
the amount in their wallet. This is a direct donation: no login, order, transaction
hash submission, expiry countdown, account credit, or automatic payment
verification. Analytics record opening and copying the address, never a purchase
or successful payment. Local preview interactions do not send donation events.

To change wallets, edit `support-config.js` and refresh asset versions. QR codes
are generated from the currently selected address in the browser, using the
locally hosted MIT-licensed qrcode-generator 2.0.4 library (loaded only on opening
the dialog). No external QR service receives the address.

### Stripe card support

Card payments are optional tips for puzzle content already provided to players.
The product description, payment description, and site copy state this purpose;
this is not charitable fundraising or a purchase of additional features. Stripe
distinguishes tips for provided goods/services (including content) from charitable
donations. The verified Hong Kong account rejected custom-amount pricing, so the
content-tip flow uses a fixed US$1 unit multiplied by the selected amount. Stripe accepting
the API request does not constitute a separate approval of the business model.
See https://support.stripe.com/questions/requirements-for-accepting-tips-or-donations.

Use the dedicated Daily Logic Lab Stripe account. Configure its business website
as `https://dailylogiclab.com/` during activation. API Route's account, recharge
price, and webhook endpoint are separate from this site.

With `stripeCheckoutEnabled: true`, the support dialog offers US$1, US$3, US$5,
US$10 and US$20 presets plus a custom integer amount from US$1 to US$1000. The
default is US$5. Players select the amount before leaving the site; the button
shows their total. All seven languages have localized labels and error messages.

`POST /api/support/checkout` creates a one-time Stripe Checkout Session using the
server's fixed price and the chosen quantity. The Worker checks the configured
account and US$1 price, validates the amount and same-origin return URL, and uses
an idempotency key for retries. Checkout receives the chosen total directly.
Stripe collects card details and records payments in its Dashboard. Success or
cancellation returns to the puzzle page without claiming payment verification.
This flow grants no account credit or paid features and needs no publishable key.
Payment reporting uses the verified server webhook described below.

The production Worker needs `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` and
`GA4_API_SECRET` as Cloudflare secrets. The
public account ID, price ID and site origin are in `wrangler.jsonc`. Before a
production deployment, configure the dedicated account's key with
`npx wrangler secret put STRIPE_SECRET_KEY`. Never put it in `support-config.js`,
HTML or any browser script. `server/` is excluded from public static assets.

For a local payment preview, put `STRIPE_SECRET_KEY`, `STRIPE_ACCOUNT_ID` and
`STRIPE_PRICE_ID` in a private env file outside the repository, then run:

```text
node --env-file=C:/path/outside/repository/dailylogiclab-stripe.env tools/preview-server.mjs 4173
npm run test:payments
```

To provision a link with the API, put `STRIPE_SECRET_KEY` and `STRIPE_ACCOUNT_ID`
(the Daily Logic Lab account's `acct_...` identifier) in a private env file outside
the repository, then run:

```text
node --env-file=C:/path/outside/repository/dailylogiclab-stripe.env tools/configure-stripe-tips.mjs
node tools/version-static-assets.mjs
```

The tool checks the account ID before making changes, reuses existing tagged
resources, or creates a dedicated content-tip product, US$1 price, and Payment
Links for US$1, US$3, US$5, US$10, and US$20. The product's price ID is used by
the Checkout backend; add it as `STRIPE_PRICE_ID` in the private preview env file
and production Worker configuration. The links remain available as a fallback:
set `stripeCheckoutEnabled: false` to use `stripeUrl`, where quantity is adjusted
on Stripe's page instead of on this site. Nothing is recurring. The tool does
not create a payment, change account settings, or touch API Route resources.
Keep all credentials outside the public static root; git and asset ignore rules
also exclude env files. After rotating a key, update the private preview env file
and the production Worker secret.

### Support analytics and search metadata

The support flow keeps its existing `donation_*` event names for continuity:

| Event | Meaning |
| --- | --- |
| `donation_prompt_view` | The puzzle completion support prompt enters the viewport |
| `donation_open` / `donation_close` | The support dialog opens or closes |
| `donation_amount_select` | A preset is chosen or a valid custom amount is committed |
| `donation_checkout_start` | A card Checkout Session is requested |
| `donation_checkout_error` | The session request or returned URL fails validation |
| `donation_card_click` | A valid card payment-page redirect is ready |
| `begin_checkout` | The selected one-time card amount is sent to Stripe Checkout |
| `donation_network_select` / `donation_token_select` | A crypto network or token is selected |
| `donation_address_copy` | A receiving address is successfully copied |

Card events carry the selected amount and payment method, not a crypto network.
`begin_checkout` includes USD value and the US$1 content-tip item quantity. Its
callback gets at most 1.5 seconds before redirect, so unavailable analytics cannot
block Checkout. Localhost support interactions are not sent to GA4. These events
do not send card details, emails, wallet addresses, transaction hashes or Checkout
Session IDs. They measure intent: no `purchase` event is emitted from a click
or a return-page visit.

`POST /api/support/stripe-webhook` verifies Stripe's raw-body HMAC signature and
five-minute timestamp window. It accepts live `checkout.session.completed` and
`checkout.session.async_payment_succeeded` events for this project, re-reads the
session from the dedicated Stripe account, and requires a complete, paid session
with the expected US$1 price, quantity and total. Only then does the server send
GA4's standard `purchase` event with USD `value`, `transaction_id` and item data.
This is successful gross card revenue, before Stripe fees and bank payouts;
refunds, disputes, net bank deposits and cryptocurrency receipts are not reported
by this integration.

A Durable Object per Checkout Session persists successful submission and
serializes duplicate callbacks. The transaction reference is a stable hash,
not a raw Stripe identifier. Failed transport returns 503 for Stripe retries.
A browser's GA4 client/session identifiers are included in Stripe metadata when
available (at most 800 ms wait); otherwise reporting uses a transaction-specific
numeric client identifier and labels visit attribution unavailable. No names,
emails, card numbers or wallet addresses are included in the purchase payload.
The browser's payment flow remains available when analytics cannot be read.

Configure the webhook using the dedicated account and a private env file outside
the repository; the tool saves the signing secret there without printing it:

```text
node --env-file=C:/private/dailylogiclab-stripe.env tools/configure-stripe-webhook.mjs C:/private/dailylogiclab-stripe.env
```

Upload the three secrets to the `dailylogiclab` Worker. The public GA4 measurement
ID and Durable Object binding/migration are in `wrangler.jsonc`. GitHub deployment
applies the migration. Standard `purchase` parameters support GA4 purchase and
revenue reports without custom revenue metrics. Google's debug validation endpoint
does not record events or validate the API secret; a successful collect HTTP
response alone also does not prove report visibility. Verify a real paid tip in
GA4 after configuration. Never send fixture purchases to the production collector.
The lightweight local preview serves Checkout, not the production Durable Object
webhook; webhook tests use isolated Stripe/GA4 stubs.

For GA4 exploration reports, register event-scoped custom dimensions for
`language`, `entry_point`, `payment_method`, `amount_source`, `chain`, `token`
and `error_stage`, and a custom metric for `amount_usd` if needed. Code changes
alone do not register these definitions or mark events as key events. Do not
label a Checkout request or an address copy as a completed payment.

The about/privacy pages explain free access and optional tips in all seven
languages. Update their content with
`node tools/generate-locales.mjs --support-only`, then refresh asset versions.
This command preserves game pages and updates only the affected sitemap dates.
`llms.txt` points to these public facts. The free game offers remain priced at
zero in structured data. Payment API responses carry `noindex, nofollow` and
`no-store`; payment API URLs do not appear in the sitemap.
