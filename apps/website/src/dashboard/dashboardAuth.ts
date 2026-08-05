/**
 * Placeholder session gate for the owner dashboard — a passcode check
 * against `BusinessSettings.dashboardPasscode`, remembered for the tab via
 * sessionStorage. This is NOT real authentication: it has no server-side
 * enforcement and the passcode ships in static-data/settings.json. See
 * docs/business-dashboard.md for what has to happen before this protects
 * anything real.
 */
function authKey(businessId: string): string {
  return `rdplatforms:dashboard-auth:${businessId}`;
}

export function isDashboardAuthed(businessId: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  return window.sessionStorage.getItem(authKey(businessId)) === 'true';
}

export function setDashboardAuthed(businessId: string): void {
  window.sessionStorage.setItem(authKey(businessId), 'true');
}

export function clearDashboardAuthed(businessId: string): void {
  window.sessionStorage.removeItem(authKey(businessId));
}
