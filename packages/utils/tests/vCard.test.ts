import { afterEach, describe, expect, it, vi } from 'vitest';
import { downloadVCard, generateVCard } from '../src/vCard';

describe('generateVCard', () => {
  it('includes required fields with correct vCard 3.0 structure', () => {
    const vcard = generateVCard({ name: 'Ritesh Dhekane', phone: '+919322527567' });
    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('VERSION:3.0');
    expect(vcard).toContain('FN:Ritesh Dhekane');
    expect(vcard).toContain('TEL;TYPE=CELL:+919322527567');
    expect(vcard).toContain('END:VCARD');
  });

  it('omits optional fields that are not provided', () => {
    const vcard = generateVCard({ name: 'Jane Doe' });
    expect(vcard).not.toContain('EMAIL:');
    expect(vcard).not.toContain('TITLE:');
    expect(vcard).not.toContain('ADR');
  });

  it('does not duplicate a TEL line when whatsapp equals phone', () => {
    const vcard = generateVCard({
      name: 'Jane Doe',
      phone: '+911234567890',
      whatsapp: '+911234567890',
    });
    const telLines = vcard.split('\r\n').filter((line) => line.startsWith('TEL'));
    expect(telLines).toHaveLength(1);
  });

  it('adds a second TEL line when whatsapp differs from phone', () => {
    const vcard = generateVCard({
      name: 'Jane Doe',
      phone: '+911234567890',
      whatsapp: '+919999999999',
    });
    const telLines = vcard.split('\r\n').filter((line) => line.startsWith('TEL'));
    expect(telLines).toHaveLength(2);
  });

  it('escapes commas, semicolons, and backslashes in free text', () => {
    const vcard = generateVCard({ name: 'Jane Doe', title: 'Owner, Founder; Lead' });
    expect(vcard).toContain('TITLE:Owner\\, Founder\\; Lead');
  });
});

describe('downloadVCard', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('creates a blob URL, triggers a click on an anchor, and revokes the URL', () => {
    const clicked: string[] = [];
    const created: unknown[] = [];
    vi.stubGlobal(
      'Blob',
      class {
        constructor(
          public parts: unknown[],
          public options: unknown,
        ) {
          created.push(this);
        }
      },
    );
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });
    vi.stubGlobal('document', {
      createElement: () => ({
        set href(_v: string) {},
        set download(_v: string) {},
        click: () => clicked.push('clicked'),
      }),
    });

    downloadVCard({ name: 'Jane Doe' }, 'jane.vcf');

    expect(created).toHaveLength(1);
    expect(clicked).toEqual(['clicked']);
    expect(
      (globalThis as unknown as { URL: { revokeObjectURL: (u: string) => void } }).URL
        .revokeObjectURL,
    ).toHaveBeenCalledWith('blob:mock-url');
  });
});
