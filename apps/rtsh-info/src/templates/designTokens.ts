/**
 * The two design-token sets Milestone 9's templates draw from, lifted
 * directly from stitch_digital_business_card_platform's two DESIGN.md
 * specs — not going through the old CardStyleConfig system (see
 * shared.tsx's QrShareButton comment for why). `blur` is explicitly
 * per-set rather than hardcoded into the shared glass components: the
 * warm-luxury spec rejects backdrop blur and heavy shadows outright
 * ("avoids harsh synthetic dropshadows... rejects aggressive bubble
 * radii"), so a shared GlassSection/ActionTile has to be able to turn
 * that off, not just recolor it.
 */
export interface GlassTokens {
  pageBackground: string;
  panelBg: string;
  panelBorder: string;
  panelShadow: string;
  tileBg: string;
  tileBorder: string;
  tileShadow: string;
  tileHoverBg: string;
  headerBg: string;
  onSurface: string;
  onSurfaceVariant: string;
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  secondary: string;
  accentGlow: string;
  /** backdrop-filter value for panels/tiles, or undefined to skip it entirely. */
  blur?: string;
  /** Corner radius (MUI sx spacing units) for panels/tiles — kept per-token-set since the two designs intentionally differ (Milestone 9's dark set is moderately rounded; the warm-luxury set is closer to rectangular). */
  panelRadius: number;
  tileRadius: number;
}

/** digital_business_card_platform/DESIGN.md — templates 1-4 (Executive Minimal, WhatsApp Storefront, Creative Portfolio, Dark Tech Glassmorphism). */
export const DARK_GLASS_TOKENS: GlassTokens = {
  pageBackground: '#090d16',
  panelBg: 'rgba(15, 23, 42, 0.75)',
  panelBorder: '1px solid rgba(255,255,255,0.09)',
  panelShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
  tileBg: 'rgba(30, 41, 59, 0.6)',
  tileBorder: '1px solid rgba(255,255,255,0.12)',
  tileShadow: '0 8px 24px -6px rgba(0,0,0,0.35)',
  tileHoverBg: 'rgba(30,41,59,0.85)',
  headerBg: 'rgba(15, 23, 42, 0.9)',
  onSurface: '#dae2fd',
  onSurfaceVariant: '#c7c4d7',
  primary: '#c0c1ff',
  primaryContainer: '#8083ff',
  onPrimary: '#1000a9',
  secondary: '#4edea3',
  accentGlow: '#494bd6',
  blur: 'blur(20px) saturate(180%)',
  panelRadius: 2.5,
  tileRadius: 2,
};

/** artisanal_warm_luxury/DESIGN.md — templates 5-6 (Artisanal Jewelry Boutique, Bistro Dining). No blur: this spec is explicit about rejecting synthetic depth in favor of flat tonal layering and hairline borders. */
export const WARM_LUXURY_TOKENS: GlassTokens = {
  pageBackground: '#fbf9f5',
  panelBg: '#ffffff',
  panelBorder: '1px solid #e2d9ce',
  panelShadow: '0 4px 20px -2px rgba(30,27,24,0.04), 0 1px 3px 0 rgba(30,27,24,0.02)',
  tileBg: '#ffffff',
  tileBorder: '1px solid #e2d9ce',
  tileShadow: '0 4px 20px -2px rgba(30,27,24,0.04)',
  tileHoverBg: '#faf2ed',
  headerBg: 'rgba(255,248,244,0.92)',
  onSurface: '#1e1b18',
  onSurfaceVariant: '#4d4635',
  primary: '#735c00',
  primaryContainer: '#d4af37',
  onPrimary: '#ffffff',
  secondary: '#c86d51',
  accentGlow: '#d4af37',
  blur: undefined,
  panelRadius: 1,
  tileRadius: 0.5,
};
