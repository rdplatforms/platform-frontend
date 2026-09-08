# Tier 2 backend — Google Apps Script

See [../../docs/backend-tiers.md](../../docs/backend-tiers.md) for the
full 3-tier picture. This folder is a **template** — the same code gets
deployed, unmodified, into every Tier 2 business's own Google account.
There is no shared infrastructure and no code here that's specific to
any one business; what's specific per business is only *where* this
gets deployed and which URL comes out the other end.

**The business owns the account, the Sheet, and the deployment** —
not rdplatforms. That's deliberate (see the plan discussion): they can
open their own bookings/messages in Google Sheets on their phone, and
nothing breaks for them if the platform relationship ever ends.

## What it does

One Apps Script Web App, bound to a Google Sheet, exposing a single
`doPost` endpoint. `apps/website`'s `AppsScriptBookingDataSource`/
`AppsScriptContactDataSource` (`packages/services`) POST a JSON envelope
`{ type: 'booking' | 'contact', businessId, ...fields }`; the script
validates it (same rules as `platform-backend`'s own validation — see
`Bookings.js`), appends a row to the matching Sheet tab (created
automatically on first use), and emails the owner a notification. No
`doGet` — this is write-only; the owner reads their data by opening the
Sheet directly, which is the entire point of this tier (no admin UI to
build or maintain).

## Cost

**$0.** Apps Script is free on a plain personal Google account, no
billing ever required. The daily ceilings that actually matter for this
use case: **100 notification emails/day** and **90 minutes of total
script execution/day** (each request here takes a fraction of a second,
so that's realistically thousands of submissions/day of headroom) — see
[docs/backend-tiers.md](../../docs/backend-tiers.md) for the sourced
numbers. A local business's booking/contact volume won't come close.
Don't pay for Google Workspace for this specifically — only if the
business separately wants professional email hosting.

## One-time setup, per business

1. **Google account.** The business's own — a dedicated one is fine,
   doesn't need to be their main personal account.
2. **Create a blank Google Sheet** in that account (name it something
   like "`<Business Name>` — Bookings & Messages"). Leave it empty —
   tabs get created automatically on first submission.
3. **`clasp login`** on your machine, signed into *that* Google account
   (temporarily, if you're setting this up on the business's behalf —
   log back out of clasp afterward: `clasp logout`).
4. **Bind a script to that Sheet**: open the Sheet → Extensions → Apps
   Script. This creates an empty bound project. Note the Script ID from
   the project's Settings (gear icon) — or run `clasp clone <scriptId>`
   into a scratch folder to confirm.
5. Copy `.clasp.json.example` → `.clasp.json` in this folder (this file
   is gitignored — never commit a real one, see the root `.gitignore`),
   fill in that Script ID.
6. **`clasp push`** from this folder — uploads `appsscript.json` +
   `src/*.js` to their bound project, overwriting the empty default.
7. **Deploy as a Web App**: in the Apps Script editor (or `clasp open`),
   Deploy → New deployment → type **Web app** → Execute as **Me** → Who
   has access **Anyone** → Deploy.
   - Google shows an OAuth consent/"unverified app" warning the first
     time — expected for a personal script, not a real security
     problem. Advanced → Go to `<project name>` (unsafe) → Allow.
   - Copy the resulting **Web app URL**
     (`https://script.google.com/macros/s/.../exec`) — this is the
     `VITE_APPS_SCRIPT_URL` for that business's website deployment (see
     [docs/deployment.md](../../docs/deployment.md)).
8. **Optional:** in the Apps Script editor, Project Settings → Script
   Properties → add `NOTIFY_EMAIL` if booking/message notifications
   should go somewhere other than the account's own inbox.
9. **Hand over ownership** — if you set this up while logged into the
   business's account on your own machine, that's already their
   account; just make sure they have the password (or set up 2FA
   recovery) and you're done. Nothing to transfer.

## Verifying it works

```bash
curl -X POST '<the exec URL from step 7>' \
  -H 'Content-Type: text/plain' \
  -d '{"type":"booking","businessId":"test","customerName":"Test Customer","serviceId":"svc-1","preferredDate":"2026-12-01","preferredTime":"11:00"}'
# {"ok":true} — and a new row should appear on the Sheet's "Bookings" tab,
# plus a notification email.

curl -X POST '<the exec URL>' \
  -H 'Content-Type: text/plain' \
  -d '{"type":"contact","businessId":"test","name":"Test","message":"Hello"}'
# {"ok":true} — new row on "Contact Messages".

curl -X POST '<the exec URL>' -H 'Content-Type: text/plain' -d '{"type":"booking"}'
# {"ok":false,"error":"customerName is required"} — still HTTP 200; see
# Code.js's own comment on why.
```

## Updating the code later

`clasp push` alone does **not** change what the live Web App URL
serves — Apps Script Web Apps are versioned. After pushing:
Deploy → Manage deployments → pick the existing deployment → the pencil
icon → Version: **New version** → Deploy. Skipping this step is the
most common "I changed the code but nothing happened" mistake with
Apps Script Web Apps.

## Why `Content-Type: text/plain`, not `application/json`

See `packages/services/src/dataSource/AppsScriptClient.ts`'s own
comment — sending `application/json` from a browser triggers a CORS
preflight request that Apps Script Web Apps don't handle, so the
request silently fails. `text/plain` avoids the preflight; `Code.js`
still parses the body as JSON regardless of the declared type. (Apps
Script's `exec` URL also replies with an internal redirect the browser
has to follow to reach the real response — `AppsScriptClient.ts` sets
`redirect: 'follow'` explicitly for this, verified against
[real-world Apps Script Web App integration writeups](https://blog.greenflux.us/so-you-want-to-send-json-to-a-google-apps-script-web-app/)
before writing this, not assumed.)

## Project layout

```
integrations/apps-script/
├── appsscript.json        Manifest — runtime, web app access/executeAs
├── .clasp.json.example    Copy to .clasp.json, fill in the real scriptId (gitignored)
└── src/
    ├── Code.js            doPost router, response/sheet helpers
    ├── Bookings.js        Booking validation + append + notify
    ├── ContactMessages.js Contact-message validation + append + notify
    └── Notify.js          Best-effort owner email notification
```
