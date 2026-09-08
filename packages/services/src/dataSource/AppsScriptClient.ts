/**
 * Every Tier 2 business runs its own copy of integrations/apps-script's
 * template, deployed as a Web App under their own Google account (see
 * that folder's README) — this is the client for calling it.
 *
 * Content-Type is deliberately "text/plain", not "application/json",
 * even though the body *is* JSON: a browser fetch() with an
 * application/json Content-Type triggers a CORS preflight (OPTIONS)
 * request, and Apps Script Web Apps don't handle preflight requests —
 * the request silently fails. text/plain is a CORS "simple request"
 * (no preflight), and Code.js still does JSON.parse(e.postData.contents)
 * on the raw body regardless of what Content-Type says. This is a
 * well-known Apps Script constraint, not a mistake.
 *
 * Web Apps also can't return a real non-200 HTTP status from
 * doPost/ContentService — every response is HTTP 200 regardless of
 * outcome, so success/failure has to live in the JSON body itself
 * (see Code.js's jsonResponse helper), never res.ok/res.status.
 *
 * An Apps Script "exec" URL also replies with an internal 302 redirect
 * to the URL that actually serves the response — fetch() follows
 * redirects by default, but it's set explicitly below so that behavior
 * doesn't depend on an implicit default a future reader wouldn't know
 * is significant here.
 */
export interface AppsScriptResponse {
  ok: boolean;
  error?: string;
}

export async function postToAppsScript(
  webAppUrl: string,
  body: unknown,
  fetchImpl: typeof fetch = fetch,
): Promise<void> {
  const res = await fetchImpl(webAppUrl, {
    method: 'POST',
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    // A non-200 here means the request never reached doPost at all
    // (network failure, wrong URL, deployment not public) — Code.js
    // itself always returns 200 with {ok:false} for an in-script error.
    throw new Error(`Apps Script request failed (${res.status})`);
  }
  const json = (await res.json()) as AppsScriptResponse;
  if (!json.ok) {
    throw new Error(json.error ?? 'Apps Script request failed');
  }
}
