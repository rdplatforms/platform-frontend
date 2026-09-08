/**
 * Tier 2 backend (see ../../docs/backend-tiers.md) — this whole project
 * is a template, deployed as-is into each business's own Google
 * account, one Sheet per business, no shared infrastructure. Meant to
 * be a *bound* script (Extensions > Apps Script, from inside the Sheet
 * itself) — getOrCreateSheet() below relies on that to find the
 * spreadsheet with zero configuration (no Sheet ID to copy anywhere).
 *
 * doPost always returns HTTP 200 — Apps Script Web Apps can't return a
 * different real HTTP status from here, so success/failure lives in the
 * JSON body's `ok` field instead (see packages/services/src/dataSource/
 * AppsScriptClient.ts on the frontend side, which knows this).
 */
function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    if (payload.type === 'booking') {
      return jsonResponse(handleBooking(payload));
    }
    if (payload.type === 'contact') {
      return jsonResponse(handleContactMessage(payload));
    }
    return jsonResponse({ ok: false, error: 'Unknown request type: ' + payload.type });
  } catch (err) {
    return jsonResponse({ ok: false, error: 'Invalid request: ' + err.message });
  }
}

function jsonResponse(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

/** Creates the tab (with a header row) on first use, so setup is just "make a blank Spreadsheet and deploy" — no manual tab creation. */
function getOrCreateSheet(name, headers) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(name);
    sheet.appendRow(headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** true/false/undefined -> "", so a blank field renders as a blank cell, not the string "undefined". */
function cell(value) {
  return value === undefined || value === null ? '' : value;
}
