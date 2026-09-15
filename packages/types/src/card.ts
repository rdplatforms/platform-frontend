/**
 * One entry in a Card's action-button row. `type` drives which icon
 * renders and how `value` is interpreted (tel:/wa.me/https URL/etc. —
 * see apps/rtsh-info's link resolution) — deliberately open-ended so
 * adding a new platform is a new entry, not a schema change. An
 * unrecognized `type` still renders, just with a generic link icon.
 */
export interface CardLink {
  type: string;
  value: string;
  label?: string;
}

/** A catalog/menu entry (Milestone 9 — the WhatsApp-storefront/boutique/bistro-style templates). `price` is free text, not a number+currency pair like Product — the designs mix "₹1,85,000", "$150/hr", "₹35,000 / $450 USD" on the same card, and a card owner typing a price by hand has no need for arithmetic on it. */
export interface CardCatalogItem {
  id: string;
  name: string;
  price?: string;
  imageUrl?: string;
  description?: string;
}

/** A short quote/review shown on the creative-portfolio-style templates. */
export interface CardTestimonial {
  id: string;
  authorName: string;
  authorRole?: string;
  quote: string;
  /** 1-5. Omit for a quote with no star rating. */
  rating?: number;
}

/** One labeled hours block — plural because some templates show more than one (e.g. a bistro's "Lunch & Aperitivo" and "Dinner & Cantina" as separate blocks), not a single fixed schedule shape. */
export interface CardHoursBlock {
  label: string;
  value: string;
}

/** A small status/verification chip (e.g. "Verified Pro", "Available for Hire", "Open Now") — plural, since a card can show more than one at once. `tone` only drives color treatment, not behavior. */
export interface CardBadge {
  label: string;
  tone?: 'verified' | 'available' | 'neutral';
}

/**
 * A personal digital business card (the rtsh-info app) — a platform-
 * owned product, not tied to any one tenant Business. `phone` is the
 * MVP routing key (see apps/rtsh-info's identifier resolution); `id` is
 * a permanent identifier present from the start so a future move to
 * opaque uid-based routing is additive, not a data migration.
 *
 * Everything below `links` is optional and Milestone 9 — a personal
 * card with none of it set renders exactly as it did before; these
 * exist for the business/merchant-style templates (storefront,
 * boutique, bistro) that need more than a name/title/links list.
 */
export interface Card {
  id: string;
  phone: string;
  name: string;
  title?: string;
  email?: string;
  location?: string;
  photoUrl?: string;
  /** One of apps/rtsh-info's predefined color styles ("style1".."style5") — an unrecognized or missing value falls back to "style1", same tolerance as an unrecognized CardLink.type. */
  style?: string;
  /** One of apps/rtsh-info's predefined layout templates ("template1".."template4") — a genuinely different component structure per value, independent of `style`'s colors. Falls back to "template1" if missing/unrecognized. */
  template?: string;
  links: CardLink[];
  /** A business/professional category tag, e.g. "Fine Jewellery & Heritage Diamonds". */
  category?: string;
  /** A WhatsApp Business number, distinct from `phone` — a merchant's calling line and WhatsApp line are often different numbers. */
  whatsapp?: string;
  /** A Google Maps embed URL (iframe `src`) for the business/merchant-style templates — `location` stays the free-text address line shown alongside it. */
  mapEmbedUrl?: string;
  hours?: CardHoursBlock[];
  /** A UPI VPA (e.g. "name@bank") — rendered as a scannable payment QR via generateQrCodeDataUrl (@rdplatforms/utils). Display only: no payment processing happens on our side. */
  upiId?: string;
  catalog?: CardCatalogItem[];
  testimonials?: CardTestimonial[];
  badges?: CardBadge[];
}
