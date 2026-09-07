import type { Booking, BookingStatus, NewBooking } from '@rdplatforms/types';

function baseUrl(): string {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    throw new Error('VITE_API_BASE_URL is not set — the portal has no backend to call.');
  }
  return url;
}

function authHeaders(token: string): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };
}

/**
 * Same reasoning as staffApi.ts: direct fetch calls against the
 * backend's auth-scoped write endpoints, not @rdplatforms/services'
 * *DataSource pattern (that's for the public site's read-only content).
 * createBooking here always sends the Authorization header, so the
 * backend records source: STAFF/status: CONFIRMED — see
 * BookingController's own comment on how it tells ONLINE and STAFF
 * bookings apart.
 */
export async function listBookings(token: string, businessId: string): Promise<Booking[]> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/bookings`, {
    headers: authHeaders(token),
  });
  if (!res.ok) {
    throw new Error('Failed to load bookings.');
  }
  return res.json();
}

export async function createWalkInBooking(
  token: string,
  businessId: string,
  input: NewBooking,
): Promise<Booking> {
  const res = await fetch(`${baseUrl()}/businesses/${encodeURIComponent(businessId)}/bookings`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error('Failed to create booking.');
  }
  return res.json();
}

export async function updateBookingStatus(
  token: string,
  businessId: string,
  bookingId: string,
  status: BookingStatus,
): Promise<Booking> {
  const res = await fetch(
    `${baseUrl()}/businesses/${encodeURIComponent(businessId)}/bookings/${encodeURIComponent(bookingId)}/status`,
    {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    },
  );
  if (!res.ok) {
    throw new Error('Failed to update booking status.');
  }
  return res.json();
}
