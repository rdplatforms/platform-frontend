/**
 * A single logged sale — a service rendered or a product sold — recorded
 * by a business owner through the per-business dashboard. See
 * docs/business-dashboard.md.
 */
export type SaleKind = 'service' | 'product';

export interface SaleEntry {
  id: string;
  businessId: string;
  kind: SaleKind;
  label: string;
  quantity: number;
  unitPrice: number;
  currency: string;
  customerName?: string;
  note?: string;
  /** ISO date (yyyy-mm-dd) the sale happened on, as entered by the owner. */
  occurredAt: string;
  /** ISO timestamp the entry was recorded, for ordering/audit — not editable. */
  createdAt: string;
}

export type NewSaleEntry = Omit<SaleEntry, 'id' | 'createdAt'>;
