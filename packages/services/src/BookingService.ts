import type { Booking, NewBooking } from '@rdplatforms/types';
import { HttpBookingDataSource } from './dataSource/HttpBookingDataSource';

// Same local-cast reasoning as activeDataSource.ts — see that file's comment.
const apiBaseUrl = (import.meta as unknown as { env?: Record<string, string | undefined> }).env
  ?.VITE_API_BASE_URL;

const httpBookingDataSource = apiBaseUrl
  ? new HttpBookingDataSource({ baseUrl: apiBaseUrl })
  : undefined;

/**
 * Best-effort: if no backend is configured (VITE_API_BASE_URL unset —
 * e.g. running purely against static-data), createBooking silently
 * resolves to undefined instead of throwing. The Appointment section
 * must never let a failed/skipped backend save block the WhatsApp
 * handoff, which is still how the customer's request actually reaches
 * the business today — see docs/appointments.md.
 */
export class BookingService {
  constructor(private readonly dataSource: HttpBookingDataSource | undefined) {}

  async createBooking(businessId: string, booking: NewBooking): Promise<Booking | undefined> {
    if (!this.dataSource) {
      return undefined;
    }
    return this.dataSource.createBooking(businessId, booking);
  }
}

export const bookingService = new BookingService(httpBookingDataSource);
