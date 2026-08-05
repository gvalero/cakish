# Cakish

Cakish is a statically exported Next.js storefront with a Cloudflare Worker for
Stripe Checkout. Signed Stripe webhooks write an operational order copy to
Cloudflare D1. The Worker also serves a small authenticated order dashboard at
`/admin`.

Stripe remains the payment authority and sends the customer payment receipt.
D1 is the operator fulfilment view; operators use it alongside Stripe alerts.
The initial Stripe-only mode sends no custom customer or baker email.

## Local development

Requirements: Node.js 22 or later, a Stripe test account, and a Cloudflare
account for Worker/D1 testing.

```powershell
npm ci
npm test
npm run lint
npm run build
npm run worker:check
```

The storefront reads `NEXT_PUBLIC_STRIPE_WORKER_URL`. Do not place any secret in
a `NEXT_PUBLIC_` variable.

## Create and bind D1

Run these commands from the repository root, using a different database and
Worker name for each environment:

```powershell
npx wrangler d1 create cakish-orders-production
```

Copy the returned `database_id`, uncomment `[[d1_databases]]` in
`worker/wrangler.toml`, and replace the documented placeholder. Then apply the
versioned migrations:

```powershell
npx wrangler d1 migrations apply cakish-orders-production --remote --config worker\wrangler.toml
```

For an isolated local database:

```powershell
npx wrangler d1 migrations apply cakish-orders-production --local --config worker\wrangler.toml
npx wrangler dev --config worker\wrangler.toml
```

Never point a development Worker at production D1. Before production migration,
export/backup D1 according to the current Cloudflare D1 documentation and test
the migration against a non-production database. A current Wrangler export can
be created with:

```powershell
npx wrangler d1 export cakish-orders-production --remote --config worker\wrangler.toml --output cakish-orders-backup.sql
```

## Secrets and variables

Set secrets interactively; never commit their values:

```powershell
npx wrangler secret put STRIPE_SECRET_KEY --config worker\wrangler.toml
npx wrangler secret put STRIPE_WEBHOOK_SECRET --config worker\wrangler.toml
npx wrangler secret put ADMIN_API_SECRET --config worker\wrangler.toml
```

`ADMIN_API_SECRET` should be a generated, high-entropy value. The dashboard
exchanges it over HTTPS for an HttpOnly, Secure, SameSite cookie; it is never
placed in a URL or localStorage. API clients may instead send
`Authorization: Bearer <secret>`. Never embed that header in HTML.

`CUSTOM_EMAILS_ENABLED` is an explicit string switch and is set to `"false"` in
production. Any value other than exactly `"true"` is safely treated as disabled.
In this mode each new order records both custom notification states as
`disabled`, no Resend request occurs, and successful persistence returns 2xx to
Stripe. Stripe's live **Successful payments** customer email setting must remain
enabled. Stripe receipts are the customer communication; Stripe alerts and the
D1 dashboard are the baker/operator workflow.

To enable custom Resend emails later:

1. Verify the sending domain/address and set `RESEND_FROM` and `NOTIFY_EMAIL`.
2. Set `RESEND_API_KEY` with `npx wrangler secret put RESEND_API_KEY --config
   worker\wrangler.toml`.
3. Test customer and baker messages, failure recording, retry, and dashboard
   access in a non-production environment.
4. Set `CUSTOM_EMAILS_ENABLED = "true"` and deploy that reviewed configuration.

Orders created while custom email is off remain `disabled`. Webhook replay and
the admin retry endpoint do not queue or send them after the switch is enabled.
Enabling applies only to newly inserted orders. Queue old orders only through a
separately reviewed D1 migration that changes the intended recipients from
`disabled` to `pending`; do not label unsent mail as `sent`.

`STOREFRONT_URL` is the canonical HTTPS origin used for every Stripe success and
cancel URL; it must not contain a path, query, or fragment.
`ALLOWED_STOREFRONT_ORIGINS` is a comma-separated list of exact HTTPS origins
allowed to call checkout and session-status routes from a browser. Production
defaults to `https://cakish.ie` as canonical and allows both that origin and
`https://www.cakish.ie`, the documented public alias. Requests carrying any
other `Origin`, including preflights, receive 403 without an
`Access-Control-Allow-Origin` header. Requests without `Origin` are intentionally
accepted for non-browser/server clients but receive no CORS header.

## Stripe webhook

In Stripe Workbench, create an HTTPS webhook endpoint:

```text
https://<worker-host>/webhooks/stripe
```

Subscribe only to:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`

Copy the endpoint signing secret with `wrangler secret put
STRIPE_WEBHOOK_SECRET`. Test mode and live mode have different secrets. During
rotation, coordinate the Stripe endpoint and Worker secret change so events are
not lost; Stripe retries failed deliveries, and reconciliation should cover the
rotation window. The Worker rejects signatures older than five minutes.

## Admin protection

The preferred setup is a dedicated admin hostname protected by a Cloudflare
Access self-hosted application:

1. Route the hostname to this Worker.
2. Create an Access allow policy for the operator identities.
3. Set `ACCESS_TEAM_DOMAIN` to the hostname only, in the exact shape
   `<team>.cloudflareaccess.com` (no scheme or path).
4. Copy the application's Audience (AUD) tag to `ACCESS_AUD`.
5. Set `ADMIN_ALLOWED_EMAILS` to the comma-separated operator emails.
6. Confirm unauthenticated requests are blocked at the edge.

The Worker validates the `Cf-Access-Jwt-Assertion` signature against the team
JWKS and verifies its exact issuer, application audience, expiry, and
not-before time when present. It derives the operator email from the verified
JWT claim; `Cf-Access-Authenticated-User-Email` is never trusted. Missing,
partial, malformed, expired, or unverifiable Access configuration/assertions
fail closed. Keep the independent `ADMIN_API_SECRET` cookie/bearer fallback for
bootstrap and recovery, and rotate it after bootstrap.

Admin access fails closed when neither `ADMIN_ALLOWED_EMAILS` nor
`ADMIN_API_SECRET` is configured. Cookie/Access mutations require a CSRF token.
Bearer API mutations do not use cookies and are CSRF-exempt.

The dashboard lists 25 orders at a time, shows order, collection, payment,
fulfilment, notes, and independent notification outcomes, and permits only:
`new`, `confirmed`, `baking`, `ready`, `collected`, `cancelled`. Internal notes
are limited to 2,000 characters. Disabled custom notifications are identified
as such and retry controls are hidden. When custom email is enabled, retry sends
only pending or failed notifications; successful notifications are not
duplicated. A `sending` claim is leased for 15 minutes. Fresh claims cannot be
taken by another execution; stale claims are reclaimed independently for baker
and customer delivery.
Resend requests retain one stable per-order/per-recipient idempotency key across
retries.

## Existing order backfill

There is deliberately no public import endpoint. For each existing paid Stripe
Checkout Session, verify payment in Stripe, inspect its metadata, and insert the
minimum fields with parameterized SQL using `wrangler d1 execute --file`. Use a
private SQL file containing no more customer data than the `orders` schema,
delete it securely afterward, and use the Stripe Session ID as the unique key.
After reviewing the file, run:

```powershell
npx wrangler d1 execute cakish-orders-production --remote --config worker\wrangler.toml --file .\private-backfill.sql
Remove-Item .\private-backfill.sql
```

Do not insert a `stripe_events` row unless it represents a real signed event.
Set notification states to `sent` only when delivery is independently known.
Use `disabled` for Stripe-only orders and `pending` only when custom delivery is
intentionally queued. Reconcile row totals and Session IDs against Stripe
before relying on the dashboard.

## Operations and recovery

1. Check Stripe webhook delivery history for failed or delayed events.
2. Compare paid Checkout Session IDs in Stripe with D1 for the affected period.
3. Retry failed Stripe deliveries after service/database recovery.
4. When custom email is enabled, use the dashboard to retry recorded
   pending/failed deliveries. In Stripe-only mode, use Stripe alerts and D1.
5. If an event can no longer be replayed, use the controlled manual SQL
   backfill procedure above, preserving the Stripe Session ID.
6. Export D1 before risky changes and periodically test restoration. D1 free
   tier retention, time-travel, export, and backup constraints can change;
   verify current Cloudflare limits and maintain an operator-owned backup plan.

Safe logs contain event/order identifiers and generic provider status only.
Provider response bodies and customer details are not returned publicly.

## Limitations and responsibilities

- D1 is eventually populated by webhooks and is not the payment ledger. Webhook
  delay, Stripe outage, Worker outage, or D1 outage can make it temporarily
  incomplete.
- The dashboard is basic fulfilment tooling, not inventory, accounting,
  analytics, tax, refunds, or customer-account software.
- Refunds, disputes, Checkout expiration, and cancellation changes are not
  automatically synchronized. Verify them in Stripe and update operational
  status manually.
- Stripe receipts contain payment information, not the custom order-confirmation
  content, and Stripe-only mode sends no baker email. Operators must monitor
  Stripe alerts and the D1 dashboard.
- When custom email is enabled, it depends on Resend, sender verification,
  quotas, and provider availability. Retries are manual or caused by a replayed
  webhook; there is no unlimited scheduled retry queue.
- Email delivery is not truly exactly-once. If execution stops after Resend
  accepts a message but before D1 records `sent`, the claim is reclaimed after
  15 minutes. The stable provider idempotency key normally deduplicates that
  retry, but provider retention/availability and an ambiguous provider response
  can still require reconciliation against Resend before another manual send.
- Existing orders require explicit import/backfill.
- D1 free-tier capacity and backup/export constraints require monitoring.
- Operators are responsible for GDPR lawful basis, access control, data
  minimization, retention/deletion schedules, data-subject requests, and breach
  handling for customer data in Stripe, D1, logs, backups, and Resend if enabled.
- Test, staging, and production need separate Stripe keys/webhook secrets, D1
  databases, Worker names/routes, email-mode configuration, and admin policies.

## Deployment safety

Do not deploy until the real D1 binding, migrations, secrets, Stripe endpoint,
Stripe receipt setting, and admin edge policy are configured and tested. Exact
first release sequence:

1. Create the production D1 database and back it up/test migrations as described
   above.
2. Uncomment the `[[d1_databases]]` block in `worker/wrangler.toml`, retain
   `binding = "DB"`, and insert the real D1 UUID (never a placeholder).
3. Retain `CUSTOM_EMAILS_ENABLED = "false"`; configure Worker secrets,
   storefront variables, Stripe webhook/receipts, and Access; validate in a
   non-production environment. Resend is not required for this initial mode.
4. Merge to `main`. The workflow installs locked dependencies and runs the D1
   preflight before any Cloudflare command.
5. Only after the preflight passes, the workflow applies remote D1 migrations.
   Only after migrations pass does it deploy the Worker.

With the binding currently commented, `npm run worker:preflight` and the
production workflow intentionally fail before migrations or deploy, leaving the
existing live Worker unchanged. The workflow deploys production only from
`main`; development pushes cannot overwrite production. Storefront development
deploys remain separate in `.github/workflows/deploy-dev.yml`.
