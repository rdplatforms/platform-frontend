var CONTACT_SHEET_NAME = 'Contact Messages';
var CONTACT_HEADERS = ['Submitted At', 'Business ID', 'Name', 'Email', 'Message'];

function handleContactMessage(payload) {
  if (!payload.name || !String(payload.name).trim()) {
    return { ok: false, error: 'name is required' };
  }
  if (!payload.message || !String(payload.message).trim()) {
    return { ok: false, error: 'message is required' };
  }

  var sheet = getOrCreateSheet(CONTACT_SHEET_NAME, CONTACT_HEADERS);
  sheet.appendRow([
    new Date(),
    cell(payload.businessId),
    cell(payload.name),
    cell(payload.email),
    cell(payload.message),
  ]);

  notifyOwner(
    'New contact message',
    'Name: ' +
      payload.name +
      (payload.email ? '\nEmail: ' + payload.email : '') +
      '\nMessage: ' +
      payload.message,
  );

  return { ok: true };
}
