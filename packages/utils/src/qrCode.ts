import QRCode from 'qrcode';

/**
 * Renders a QR code entirely client-side (canvas under the hood, no
 * network call) as a PNG data URL — usable directly as an <img src>.
 * Platform-wide, not tied to any one app: a card's own share link, a
 * business's UPI payment ID, a printed-card URL, anything that's just
 * "encode this text as a QR."
 */
export function generateQrCodeDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    errorCorrectionLevel: 'M',
    margin: 1,
    width: 512,
  });
}
