import type { Booking, NewBooking } from '@rdplatforms/types';

export interface HttpBookingDataSourceOptions {
  /** e.g. "http://localhost:8081" — no trailing slash. */
  baseUrl: string;
  fetchImpl?: typeof fetch;
}

/**
 * Calls the backend's POST /businesses/{id}/bookings (see TASK-013 and
 * backend/README.md's Bookings section) — no unauthenticated request
 * ever needs a JsonDataSource-style fallback here, since bookings never
 * existed in static-data to begin with (unlike the read-only content
 * types, which predate the backend). See BookingService for what
 * happens when there's no backend configured at all.
 */
export class HttpBookingDataSource {
  constructor(private readonly options: HttpBookingDataSourceOptions) {}

  async createBooking(businessId: string, booking: NewBooking): Promise<Booking> {
    const res = await (this.options.fetchImpl ?? fetch)(
      `${this.options.baseUrl}/businesses/${encodeURIComponent(businessId)}/bookings`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      },
    );
    if (!res.ok) {
      throw new Error(`Failed to create booking (${res.status})`);
    }
    return (await res.json()) as Booking;
  }
}
