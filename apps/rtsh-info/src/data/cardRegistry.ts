import type { Card } from '@rdplatforms/types';
import cardIndex from '@rdplatforms/static-data/cards/index';
import riteshDhekane from '@rdplatforms/static-data/cards/ritesh-dhekane';

/**
 * Every card JSON file is statically imported and registered here — same
 * spirit as JsonDataSource's BUSINESSES_BY_SLUG registry in
 * packages/services, kept local to this app since a Card isn't part of
 * the business-content domain. This registry is the seam a future
 * backend/table replaces (see TASKS.md Milestone 4).
 */
const CARDS_BY_ID: Record<string, Card> = {
  'ritesh-dhekane': riteshDhekane as Card,
};

function significantDigits(value: string): string {
  return value.replace(/\D/g, '').slice(-10);
}

/**
 * The MVP QR code encodes a phone number, typed/scanned in inconsistent
 * formats (+91..., 91..., bare 10-digit) — matched on the last 10
 * digits rather than an exact string. A non-phone-shaped identifier is
 * matched against `id` directly instead, so the same resolver already
 * supports the future opaque-uid routing scheme without changing this
 * function again later.
 */
export function findCardByIdentifier(identifier: string): Card | undefined {
  const cards = cardIndex.ids.map((id) => CARDS_BY_ID[id]).filter((c): c is Card => Boolean(c));
  const target = significantDigits(identifier);
  if (target.length === 10) {
    return cards.find((card) => significantDigits(card.phone) === target);
  }
  return cards.find((card) => card.id === identifier);
}
