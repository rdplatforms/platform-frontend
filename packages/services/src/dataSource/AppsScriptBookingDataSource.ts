import type { Booking, NewBooking } from '@rdplatforms/types';
import { postToAppsScript } from './AppsScriptClient';
import type { BookingDataSource } from './types';

export interface AppsScriptBookingDataSourceOptions {
  /** The business's own Apps Script Web App "exec" URL — see integrations/apps-script/README.md. */
  webAppUrl: string;
  fetchImpl?: typeof fetch;
}

/**
 * Tier 2's booking backend — a business's own Google Sheet, via their
 * own Apps Script Web App deployment. There's no real database
 * generating an id/status the way platform-backend does, so this
 * synthesizes a client-side Booking to satisfy BookingDataSource's
 * contract — nothing downstream reads the return value beyond
 * try/catch (see Appointment.tsx), so a synthesized id is harmless.
 */
export class AppsScriptBookingDataSource implements BookingDataSource {
  constructor(private readonly options: AppsScriptBookingDataSourceOptions) {}

  async createBooking(businessId: string, booking: NewBooking): Promise<Booking> {
    await postToAppsScript(
      this.options.webAppUrl,
      { type: 'booking', businessId, ...booking },
      this.options.fetchImpl,
    );
    return {
      id: crypto.randomUUID(),
      businessId,
      status: 'PENDING',
      source: 'ONLINE',
      createdAt: new Date().toISOString(),
      ...booking,
    };
  }
}
