import { Button as MuiButton, type ButtonProps as MuiButtonProps } from '@mui/material';

/**
 * MUI's ButtonProps only exposes `href`, not the rest of the anchor
 * attribute set — this widens it so callers can pass target/rel when
 * linking a button externally (e.g. WhatsApp) without reaching for
 * `component="a"` everywhere.
 */
export type ButtonProps = MuiButtonProps & {
  target?: string;
  rel?: string;
};

/**
 * A thin wrapper rather than a re-export so the platform has one place to
 * change default button behavior (e.g. default variant) across every
 * business without touching MUI's own defaults globally.
 */
export function Button({ variant = 'contained', ...props }: ButtonProps) {
  return <MuiButton variant={variant} {...props} />;
}
