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
  /** A short second line under the label, e.g. "48 Public Repos · 1.2k Stars" — for the templates (Dark Tech Glassmorphism) whose link rows read as a richer directory entry rather than a bare icon + name. */
  subtitle?: string;
}

/** A catalog/menu entry (Milestone 9 — the WhatsApp-storefront/boutique/bistro-style templates). `price` is free text, not a number+currency pair like Product — the designs mix "₹1,85,000", "$150/hr", "₹35,000 / $450 USD" on the same card, and a card owner typing a price by hand has no need for arithmetic on it. */
export interface CardCatalogItem {
  id: string;
  name: string;
  price?: string;
  imageUrl?: string;
  description?: string;
  /** A small overlay label on the item's image, e.g. "Turnkey Package", "Popular Audit". */
  badge?: string;
  /** A short fulfilment line, e.g. "14 Days Delivery", "48h Turnaround". */
  deliveryInfo?: string;
  /** Overrides the default "Inquire on WhatsApp" button text, e.g. "Instant Booking", "Details & Buy". */
  ctaLabel?: string;
  /** Visual weight of the CTA button. Defaults to 'outline' (the original single-style button). */
  ctaTone?: 'solid' | 'accent' | 'outline';
  /** Short attribute tags, e.g. ["Vegetarian", "Organic Flour"] or ["Gluten Free", "12h Slow Cook"] — for menu-style catalogs where each item has a couple of short facts worth surfacing without a full description. */
  tags?: string[];
}

/** A short trust/fulfilment highlight shown near a merchant's contact actions, e.g. "Express Delivery", "Escrow Guaranteed". `icon` only drives which glyph renders. */
export interface CardHighlight {
  label: string;
  icon?: 'delivery' | 'escrow' | 'reply' | 'check';
}

/** A quantified achievement shown as a big number + a short label underneath, e.g. { value: "9+", label: "Yrs Exp" } — for the personal-professional templates (Creative Portfolio and similar) that lead with a track record. */
export interface CardStat {
  value: string;
  label: string;
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
  /** A short footnote under the value, e.g. "Tuesday through Sunday, Walk-ins Welcome". */
  note?: string;
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
  /** One of apps/rtsh-info's predefined templates (e.g. "executive-minimal", "bistro-dining" — see CARD_TEMPLATES) — each one is a fully self-styled component, not a layout paired with a separate recolorable `style` (that split existed pre-Milestone-9; see docs/rtsh-info.md). Falls back to "executive-minimal" if missing/unrecognized. */
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
  /** A short paragraph bio, shown on the personal-professional templates (Executive Minimal, Creative Portfolio, Dark Tech). */
  bio?: string;
  /** Skill/stack tags shown alongside `bio`, e.g. ["Kubernetes", "AWS/GCP", "Terraform"]. */
  skills?: string[];
  /** A wide cover photo shown behind the hero panel's avatar, e.g. a storefront/workspace photo. Distinct from `photoUrl` (the avatar image itself). */
  bannerUrl?: string;
  /** An aggregate review score, e.g. from Google/WhatsApp Business, shown next to the verification badges. */
  rating?: { value: number; count: number };
  /** Manually set by whoever maintains the card (no live backend/clock in Milestone 9) — renders an "Open Now" chip when true. Omit rather than guess from `hours`. */
  openNow?: boolean;
  highlights?: CardHighlight[];
  /** The specific outlet/venue name shown above the map embed, e.g. "Flagship Studio & Tech Hub" — distinct from the business name (`name`/`title`). */
  locationName?: string;
  /** A social/portfolio handle shown above the name, e.g. "@ritesh.designs" — distinct from `title` (the role line below the name). */
  handle?: string;
  stats?: CardStat[];
  /** A link to leave a public review (e.g. a Google Business review link) — renders a small "ask for a review" banner when set. Distinct from `testimonials` (quotes already collected, shown on the card itself). */
  reviewUrl?: string;
}
