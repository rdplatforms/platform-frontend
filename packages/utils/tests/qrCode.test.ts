import { describe, expect, it } from 'vitest';
import { generateQrCodeDataUrl } from '../src/qrCode';

describe('generateQrCodeDataUrl', () => {
  it('resolves a PNG data URL', async () => {
    const dataUrl = await generateQrCodeDataUrl('https://rtsh.info/9322527567');
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('produces different output for different input text', async () => {
    const a = await generateQrCodeDataUrl('https://rtsh.info/one');
    const b = await generateQrCodeDataUrl('https://rtsh.info/two');
    expect(a).not.toBe(b);
  });
});
