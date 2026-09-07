/**
 * A backend-persisted bill (TASKS.md Milestone 5) — supersedes the old
 * client-only SaleEntry, which modeled one line item per record. See
 * platform-backend's README.md "Sales / Billing" section.
 */
export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'OTHER';

/** STAFF = logged through apps/portal's billing UI; ONLINE = apps/website's public shop checkout (Milestone 6) — never client-supplied, decided server-side by whether a valid token is present. */
export type SaleSource = 'STAFF' | 'ONLINE';

export interface NewSaleItem {
  label: string;
  category?: string;
  quantity: number;
  unitPrice: number;
  /** A flat amount subtracted from this line's subtotal, not a percentage. */
  discount: number;
}

export interface SaleItem extends NewSaleItem {
  id: string;
}

export interface NewSale {
  /** When present, the referenced Booking is marked COMPLETED as a side effect of billing it. */
  bookingId?: string;
  paymentMethod: PaymentMethod;
  customerName?: string;
  /** Only meaningful for an online checkout — how else would you reach the customer? A staff-entered bill leaves both undefined. */
  customerEmail?: string;
  customerPhone?: string;
  items: NewSaleItem[];
}

export interface Sale {
  id: string;
  businessId: string;
  bookingId?: string;
  source: SaleSource;
  paymentMethod: PaymentMethod;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  /** Absent for a source: 'ONLINE' sale — there's no staff member to attribute it to. */
  createdByUserId?: string;
  /** Server-computed sum of every item's (quantity * unitPrice - discount) — never client-supplied. */
  totalAmount: number;
  createdAt: string;
  items: SaleItem[];
}
