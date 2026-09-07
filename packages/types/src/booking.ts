/**
 * A real, backend-persisted appointment request (TASKS.md Milestone 3) —
 * distinct from the WhatsApp handoff message built in
 * packages/utils/src/appointment.ts, which is a notify side-effect, not
 * the record of truth. See docs/appointments.md.
 */
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

/** ONLINE = submitted through the public website with no auth; STAFF = added manually in apps/portal. */
export type BookingSource = 'ONLINE' | 'STAFF';

export interface NewBooking {
  serviceId: string;
  customerName: string;
  /** ISO date, "yyyy-MM-dd". */
  preferredDate: string;
  preferredTime: string;
  note?: string;
}

export interface Booking extends NewBooking {
  id: string;
  businessId: string;
  status: BookingStatus;
  source: BookingSource;
  createdAt: string;
}
