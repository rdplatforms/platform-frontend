import type { SxProps, Theme } from '@mui/material';

/**
 * Every color/surface variant a Card can pick via its `style` field —
 * purely palette, not layout (see cardTemplates.tsx for the structural
 * variants). Adding a new one is one entry here — nothing that renders
 * it needs to change. An unrecognized/missing `style` falls back to
 * "style1" (see resolveCardStyle below).
 */
export interface CardStyleConfig {
  label: string;
  background: string;
  textColor: string;
  secondaryTextColor: string;
  avatarRing: string;
  /** Full-width pill button, used by list-style link layouts. */
  buttonSx: SxProps<Theme>;
  /** Circular icon-only button, used by grid-style link layouts. */
  iconButtonSx: SxProps<Theme>;
}

const PILL_BUTTON_BASE: SxProps<Theme> = {
  justifyContent: 'center',
  py: 1.5,
  borderRadius: 999,
  textTransform: 'none',
  fontWeight: 600,
  boxShadow: 'none',
};

const ICON_BUTTON_BASE: SxProps<Theme> = {
  width: 56,
  height: 56,
  borderRadius: '50%',
  boxShadow: 'none',
};

export const CARD_STYLES: Record<string, CardStyleConfig> = {
  style1: {
    label: 'Classic',
    background: '#f7f7fa',
    textColor: '#1a1a2e',
    secondaryTextColor: '#5c5c72',
    avatarRing: '#1B1F3B',
    buttonSx: {
      ...PILL_BUTTON_BASE,
      bgcolor: '#1B1F3B',
      color: '#fff',
      '&:hover': { bgcolor: '#2a2f57' },
    },
    iconButtonSx: {
      ...ICON_BUTTON_BASE,
      bgcolor: '#1B1F3B',
      color: '#fff',
      '&:hover': { bgcolor: '#2a2f57' },
    },
  },
  style2: {
    label: 'Midnight',
    background: 'linear-gradient(160deg, #0f1024 0%, #1b1f3b 100%)',
    textColor: '#ffffff',
    secondaryTextColor: 'rgba(255,255,255,0.7)',
    avatarRing: 'rgba(255,255,255,0.4)',
    buttonSx: {
      ...PILL_BUTTON_BASE,
      bgcolor: 'rgba(255,255,255,0.08)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.16)',
      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
    },
    iconButtonSx: {
      ...ICON_BUTTON_BASE,
      bgcolor: 'rgba(255,255,255,0.08)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.16)',
      '&:hover': { bgcolor: 'rgba(255,255,255,0.16)' },
    },
  },
  style3: {
    label: 'Sunset',
    background: 'linear-gradient(160deg, #ff8a65 0%, #ff5e94 100%)',
    textColor: '#ffffff',
    secondaryTextColor: 'rgba(255,255,255,0.85)',
    avatarRing: 'rgba(255,255,255,0.6)',
    buttonSx: {
      ...PILL_BUTTON_BASE,
      bgcolor: 'rgba(255,255,255,0.92)',
      color: '#7a2b48',
      '&:hover': { bgcolor: '#ffffff' },
    },
    iconButtonSx: {
      ...ICON_BUTTON_BASE,
      bgcolor: 'rgba(255,255,255,0.92)',
      color: '#7a2b48',
      '&:hover': { bgcolor: '#ffffff' },
    },
  },
  style4: {
    label: 'Minimal',
    background: '#ffffff',
    textColor: '#111111',
    secondaryTextColor: '#666666',
    avatarRing: '#111111',
    buttonSx: {
      ...PILL_BUTTON_BASE,
      bgcolor: 'transparent',
      color: '#111111',
      border: '1.5px solid #111111',
      '&:hover': { bgcolor: '#111111', color: '#fff' },
    },
    iconButtonSx: {
      ...ICON_BUTTON_BASE,
      bgcolor: 'transparent',
      color: '#111111',
      border: '1.5px solid #111111',
      '&:hover': { bgcolor: '#111111', color: '#fff' },
    },
  },
  style5: {
    label: 'Ocean',
    background: 'linear-gradient(160deg, #0f766e 0%, #0891b2 100%)',
    textColor: '#ffffff',
    secondaryTextColor: 'rgba(255,255,255,0.85)',
    avatarRing: 'rgba(255,255,255,0.6)',
    buttonSx: {
      ...PILL_BUTTON_BASE,
      bgcolor: 'rgba(255,255,255,0.14)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.3)',
      '&:hover': { bgcolor: 'rgba(255,255,255,0.24)' },
    },
    iconButtonSx: {
      ...ICON_BUTTON_BASE,
      bgcolor: 'rgba(255,255,255,0.14)',
      color: '#fff',
      border: '1px solid rgba(255,255,255,0.3)',
      '&:hover': { bgcolor: 'rgba(255,255,255,0.24)' },
    },
  },
};

const DEFAULT_STYLE = CARD_STYLES.style1 as CardStyleConfig;

export function resolveCardStyle(style: string | undefined): CardStyleConfig {
  return (style && CARD_STYLES[style]) || DEFAULT_STYLE;
}
