/** The minimal shape generateVCard needs — deliberately not `Card` itself, so this stays usable outside apps/rtsh-info too (e.g. a business's own staff directory later). */
export interface VCardContact {
  name: string;
  title?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  website?: string;
}

function escapeVCardText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

/**
 * Plain vCard 3.0 text (RFC 2426) — the format every phone's contacts
 * app already knows how to import, so "Save Contact" needs nothing
 * beyond generating this string and triggering a download
 * (downloadVCard below). No third-party library: the format is simple
 * enough that one would be more code, not less.
 */
export function generateVCard(contact: VCardContact): string {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardText(contact.name)}`,
    `N:${escapeVCardText(contact.name)};;;`,
  ];

  if (contact.title) {
    lines.push(`TITLE:${escapeVCardText(contact.title)}`);
  }
  if (contact.phone) {
    lines.push(`TEL;TYPE=CELL:${contact.phone}`);
  }
  if (contact.whatsapp && contact.whatsapp !== contact.phone) {
    lines.push(`TEL;TYPE=WORK:${contact.whatsapp}`);
  }
  if (contact.email) {
    lines.push(`EMAIL:${escapeVCardText(contact.email)}`);
  }
  if (contact.address) {
    lines.push(`ADR;TYPE=WORK:;;${escapeVCardText(contact.address)};;;;`);
  }
  if (contact.website) {
    lines.push(`URL:${contact.website}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/** Triggers a browser download of the given vCard text as a .vcf file — the only DOM-touching function in this file, kept separate from generateVCard so the text-generation half stays trivially testable. */
export function downloadVCard(contact: VCardContact, filename = 'contact.vcf'): void {
  const blob = new Blob([generateVCard(contact)], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
