/**
 * Best-effort — a failed/misconfigured notification must never fail the
 * whole request (the row is already saved by the time this runs; losing
 * an email ping is far better than losing the booking/message itself).
 *
 * Recipient defaults to whichever Google account owns this script
 * (Session.getEffectiveUser()) — override by setting a Script Property
 * named NOTIFY_EMAIL if the owner wants notifications sent somewhere
 * else. Project Settings > Script Properties in the Apps Script editor,
 * no code change needed.
 */
function notifyOwner(subject, body) {
  try {
    var recipient =
      PropertiesService.getScriptProperties().getProperty('NOTIFY_EMAIL') ||
      Session.getEffectiveUser().getEmail();
    if (!recipient) {
      return;
    }
    MailApp.sendEmail(recipient, subject, body);
  } catch (err) {
    // Swallowed deliberately — see comment above.
  }
}
