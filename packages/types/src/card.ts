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

/**
 * A personal digital business card (the rtsh-info app) — a platform-
 * owned product, not tied to any one tenant Business. `phone` is the
 * MVP routing key (see apps/rtsh-info's identifier resolution); `id` is
 * a permanent identifier present from the start so a future move to
 * opaque uid-based routing is additive, not a data migration.
 */
export interface Card {
  id: string;
  phone: string;
  name: string;
  title?: string;
  email?: string;
  location?: string;
  photoUrl?: string;
  links: CardLink[];
}
