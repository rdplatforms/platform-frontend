/**
 * A catalog item (TASKS.md Milestone 6) — real backend entity (not
 * static-data JSON like ServiceItem), since apps/portal needs real CRUD
 * over it (TASK-023). `name`/`description` are plain strings, not
 * bilingual `LocalizableText` like ServiceItem — a deliberate v1 scope
 * cut. Field names mirror the backend's JSON wire shape exactly,
 * including `featured` (not `isFeatured` — Jackson's bean-property
 * convention strips the `is` prefix off a `boolean isFeatured` getter,
 * so that's what actually comes back over the wire).
 */
export interface Product {
  id: string;
  businessId: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  category?: string;
  /** Undefined/null = not tracked/unlimited, not zero. */
  stockQuantity?: number;
  featured: boolean;
  createdAt: string;
}

export type NewProduct = Omit<Product, 'id' | 'businessId' | 'createdAt'>;
