var BOOKINGS_SHEET_NAME = 'Bookings';
var BOOKINGS_HEADERS = [
  'Submitted At',
  'Business ID',
  'Service',
  'Customer Name',
  'Preferred Date',
  'Preferred Time',
  'Note',
];

/**
 * Same validation shape as platform-backend's BookingController — a
 * public write endpoint (this is one, same as that one) can't trust the
 * frontend's own client-side checks are the only line of defense.
 */
function handleBooking(payload) {
  if (!payload.customerName || !String(payload.customerName).trim()) {
    return { ok: false, error: 'customerName is required' };
  }
  if (!payload.serviceId || !String(payload.serviceId).trim()) {
    return { ok: false, error: 'serviceId is required' };
  }
  if (!payload.preferredDate || !/^\d{4}-\d{2}-\d{2}$/.test(payload.preferredDate)) {
    return { ok: false, error: 'preferredDate must be yyyy-MM-dd' };
  }
  if (!payload.preferredTime || !/^([01]\d|2[0-3]):[0-5]\d$/.test(payload.preferredTime)) {
    return { ok: false, error: 'preferredTime must be HH:mm' };
  }

  var sheet = getOrCreateSheet(BOOKINGS_SHEET_NAME, BOOKINGS_HEADERS);
  sheet.appendRow([
    new Date(),
    cell(payload.businessId),
    cell(payload.serviceId),
    cell(payload.customerName),
    cell(payload.preferredDate),
    cell(payload.preferredTime),
    cell(payload.note),
  ]);

  notifyOwner(
    'New booking request',
    'Customer: ' +
      payload.customerName +
      '\nService: ' +
      payload.serviceId +
      '\nPreferred: ' +
      payload.preferredDate +
      ' ' +
      payload.preferredTime +
      (payload.note ? '\nNote: ' + payload.note : ''),
  );

  return { ok: true };
}
