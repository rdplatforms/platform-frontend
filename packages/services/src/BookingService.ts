import type { Booking, NewBooking } from '@rdplatforms/types';
import { AppsScriptBookingDataSource } from './dataSource/AppsScriptBookingDataSource';
import { HttpBookingDataSource } from './dataSource/HttpBookingDataSource';
import type { BookingDataSource } from './dataSource/types';

// Same local-cast reasoning as activeDataSource.ts — see that file's comment.
const env = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
const apiBaseUrl = env?.VITE_API_BASE_URL;
const appsScriptUrl = env?.VITE_APPS_SCRIPT_URL;

/**
 * Tier selection (see docs/backend-tiers.md): Tier 3 (platform-backend)
 * wins if VITE_API_BASE_URL is set; else Tier 2 (a business's own Apps
 * Script deployment) if VITE_APPS_SCRIPT_URL is set; else Tier 1 — no
 * dataSource at all, matching every business's behavior before this
 * existed. Exactly one tier var is expected per deployment (each
 * business gets its own separate build/deploy — see docs/deployment.md),
 * but if both were somehow set, Tier 3 wins deliberately: a real backend
 * is strictly more capable than a Sheet.
 */
const bookingDataSource: BookingDataSource | undefined = apiBaseUrl
  ? new HttpBookingDataSource({ baseUrl: apiBaseUrl })
  : appsScriptUrl
    ? new AppsScriptBookingDataSource({ webAppUrl: appsScriptUrl })
    : undefined;

/**
 * Best-effort: if no backend is configured (Tier 1), createBooking
 * silently resolves to undefined instead of throwing. The Appointment
 * section must never let a failed/skipped backend save block the
 * WhatsApp handoff, which is still how the customer's request actually
 * reaches the business today — see docs/appointments.md.
 */
export class BookingService {
  constructor(private readonly dataSource: BookingDataSource | undefined) {}

  async createBooking(businessId: string, booking: NewBooking): Promise<Booking | undefined> {
    if (!this.dataSource) {
      return undefined;
    }
    return this.dataSource.createBooking(businessId, booking);
  }
}

export const bookingService = new BookingService(bookingDataSource);
