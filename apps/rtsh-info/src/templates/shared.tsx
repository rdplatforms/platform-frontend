import { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  type SxProps,
  type Theme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import {
  formatPhoneForDisplay,
  generateQrCodeDataUrl,
  getAvatarColors,
  getInitials,
  toWhatsAppLink,
} from '@rdplatforms/utils';
import type { Card, CardBadge, CardCatalogItem, CardLink } from '@rdplatforms/types';
import type { CardStyleConfig } from '../cardStyles';
import { hrefForLink, iconForLink, labelForLink } from '../linkPresentation';
import type { GlassTokens } from './designTokens';

/**
 * Building blocks every template composes differently — avatar
 * placement/size and link layout are exactly what varies template to
 * template, so they're the pieces worth sharing; each template still
 * owns its own overall structure.
 */

export function AvatarBadge({
  card,
  style,
  size = 128,
}: {
  card: Card;
  style: CardStyleConfig;
  size?: number;
}) {
  const colors = getAvatarColors(card.name);
  return (
    <Avatar
      src={card.photoUrl || undefined}
      alt={card.name}
      sx={{
        width: size,
        height: size,
        fontSize: size * 0.32,
        fontWeight: 700,
        bgcolor: colors.bg,
        color: colors.fg,
        border: `3px solid ${style.avatarRing}`,
      }}
    >
      {getInitials(card.name)}
    </Avatar>
  );
}

export function LinkButtonList({ links, style }: { links: CardLink[]; style: CardStyleConfig }) {
  return (
    <Stack spacing={1.5} sx={{ width: '100%' }}>
      {links.map((link, index) => {
        const Icon = iconForLink(link);
        return (
          <Button
            key={`${link.type}-${index}`}
            component="a"
            href={hrefForLink(link)}
            target={link.type === 'call' ? undefined : '_blank'}
            rel="noopener noreferrer"
            size="large"
            startIcon={<Icon />}
            fullWidth
            sx={style.buttonSx}
          >
            {labelForLink(link)}
          </Button>
        );
      })}
    </Stack>
  );
}

export function LinkIconGrid({
  links,
  style,
  columns = 3,
}: {
  links: CardLink[];
  style: CardStyleConfig;
  columns?: number;
}) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: 2,
        width: '100%',
      }}
    >
      {links.map((link, index) => {
        const Icon = iconForLink(link);
        return (
          <Stack key={`${link.type}-${index}`} spacing={0.5} alignItems="center">
            <Tooltip title={labelForLink(link)}>
              <IconButton
                component="a"
                href={hrefForLink(link)}
                target={link.type === 'call' ? undefined : '_blank'}
                rel="noopener noreferrer"
                sx={style.iconButtonSx}
              >
                <Icon />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" sx={{ color: style.secondaryTextColor }} noWrap>
              {labelForLink(link)}
            </Typography>
          </Stack>
        );
      })}
    </Box>
  );
}

export function ContactLines({
  card,
  style,
  align = 'center',
}: {
  card: Card;
  style: CardStyleConfig;
  align?: 'center' | 'flex-start';
}) {
  return (
    <Stack spacing={1} alignItems={align}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ color: style.secondaryTextColor }}
      >
        <PhoneIcon fontSize="small" />
        <Typography variant="body2">{formatPhoneForDisplay(card.phone)}</Typography>
      </Stack>
      {card.email ? (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ color: style.secondaryTextColor }}
        >
          <EmailIcon fontSize="small" />
          <Typography variant="body2">{card.email}</Typography>
        </Stack>
      ) : null}
    </Stack>
  );
}

/**
 * Renders the card's own QR code in a modal, generated on first open
 * (not eagerly — most visitors never tap it) via generateQrCodeDataUrl
 * (@rdplatforms/utils, Milestone 9). Deliberately style-agnostic beyond
 * the `sx` passed in: each Milestone 9 template hardcodes its own
 * design tokens rather than going through the old CardStyleConfig
 * abstraction (see cardStyles.ts's own comment — that one's scoped to
 * the 4 templates being retired in TASK-046).
 */
export function QrShareButton({
  url,
  label = 'Share',
  iconOnly = false,
  sx,
}: {
  url: string;
  label?: string;
  iconOnly?: boolean;
  sx?: SxProps<Theme>;
}) {
  const [open, setOpen] = useState(false);
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    if (dataUrl) return;
    setLoading(true);
    setDataUrl(await generateQrCodeDataUrl(url));
    setLoading(false);
  };

  return (
    <>
      {iconOnly ? (
        <Tooltip title={label}>
          <IconButton onClick={handleOpen} aria-label={label} sx={sx}>
            <QrCode2Icon />
          </IconButton>
        </Tooltip>
      ) : (
        <Button onClick={handleOpen} startIcon={<QrCode2Icon />} sx={sx}>
          {label}
        </Button>
      )}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, p: 4 }}
        >
          {loading || !dataUrl ? (
            <Box
              sx={{
                width: 240,
                height: 240,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box component="img" src={dataUrl} alt="QR code" sx={{ width: 240, height: 240 }} />
          )}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ wordBreak: 'break-all', textAlign: 'center' }}
          >
            {url}
          </Typography>
        </DialogContent>
      </Dialog>
    </>
  );
}

const BADGE_TONE_COLORS: Record<
  NonNullable<CardBadge['tone']>,
  { bg: string; fg: string; dot?: boolean }
> = {
  verified: { bg: 'rgba(212, 175, 55, 0.15)', fg: '#D4AF37' },
  available: { bg: 'rgba(16, 185, 129, 0.15)', fg: '#10B981', dot: true },
  neutral: { bg: 'rgba(148, 163, 184, 0.18)', fg: '#94A3B8' },
};

/** A small status pill (e.g. "Verified Pro", "Available for Hire") — color comes from `badge.tone`, not from the surrounding template, so it reads consistently across every template's own palette. */
export function BadgeChip({ badge }: { badge: CardBadge }) {
  const colors = BADGE_TONE_COLORS[badge.tone ?? 'neutral'];
  return (
    <Stack
      direction="row"
      spacing={0.75}
      alignItems="center"
      sx={{
        display: 'inline-flex',
        bgcolor: colors.bg,
        color: colors.fg,
        borderRadius: 999,
        px: 1.25,
        py: 0.5,
      }}
    >
      {colors.dot ? (
        <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: colors.fg }} />
      ) : null}
      <Typography variant="caption" sx={{ fontWeight: 700, color: 'inherit', lineHeight: 1 }}>
        {badge.label}
      </Typography>
    </Stack>
  );
}

/** One catalog/menu row: name (+ optional description) on the left, price right-aligned. No hardcoded text color — inherits from whatever template wraps it, so it works on both light and dark backgrounds without a style prop. */
export function PriceRow({
  name,
  description,
  price,
}: {
  name: string;
  description?: string;
  price?: string;
}) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="flex-start"
      spacing={2}
      sx={{ width: '100%' }}
    >
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body1" fontWeight={600} color="inherit" noWrap>
          {name}
        </Typography>
        {description ? (
          <Typography variant="body2" color="inherit" sx={{ opacity: 0.7 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {price ? (
        <Typography variant="body1" fontWeight={700} color="inherit" sx={{ flexShrink: 0 }}>
          {price}
        </Typography>
      ) : null}
    </Stack>
  );
}

/**
 * Two large, slow ambient light sources fixed behind the whole page
 * (DESIGN.md's "Base Layer") — shared by every Milestone 9 template
 * that opts in, not just an effect inside one hero card. A
 * `WARM_LUXURY_TOKENS`-driven template can render this too (its
 * `accentGlow`/`secondary` are still real colors), but the warm-luxury
 * spec's own aesthetic reads better without it — leave it out rather
 * than force ambient glow onto a design that's deliberately flat.
 */
export function AmbientBackdrop({ tokens }: { tokens: GlassTokens }) {
  return (
    <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -100,
          width: 420,
          height: 420,
          borderRadius: '50%',
          bgcolor: tokens.accentGlow,
          opacity: 0.25,
          filter: 'blur(120px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -140,
          left: -100,
          width: 380,
          height: 380,
          borderRadius: '50%',
          bgcolor: tokens.secondary,
          opacity: 0.15,
          filter: 'blur(120px)',
        }}
      />
    </Box>
  );
}

/** The geometric mesh line-art behind a hero card — ported from the Stitch reference markup (template_1_executive_minimal/code.html), colored from `tokens` so it works for either token set. */
export function HeroMesh({ tokens }: { tokens: GlassTokens }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 400 320"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}
    >
      <circle cx="340" cy="40" r="140" fill={tokens.accentGlow} opacity="0.35" />
      <circle cx="50" cy="180" r="120" fill={tokens.secondary} opacity="0.2" />
      <path
        d="M-20 60 L180 20 L240 160 L40 220 Z"
        stroke={tokens.primary}
        strokeWidth="0.75"
        strokeDasharray="4 6"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M120 -10 L380 90 L310 260 L90 190 Z"
        stroke={tokens.primaryContainer}
        strokeWidth="0.5"
        strokeDasharray="3 5"
        opacity="0.3"
        fill="none"
      />
    </Box>
  );
}

/** A translucent (or, for a no-blur token set, opaque) elevated panel — the "Glass Shell"/"Elevated Nodes" recipe from DESIGN.md: background + optional backdrop-filter + a light-catch rim border + a soft directional shadow, not a flat fill. */
export function GlassSection({
  tokens,
  children,
  sx,
}: {
  tokens: GlassTokens;
  children: React.ReactNode;
  sx?: SxProps<Theme>;
}) {
  return (
    <Stack
      spacing={1.5}
      sx={{
        position: 'relative',
        bgcolor: tokens.panelBg,
        backdropFilter: tokens.blur,
        border: tokens.panelBorder,
        boxShadow: tokens.panelShadow,
        borderRadius: tokens.panelRadius,
        p: 2.5,
        ...sx,
      }}
    >
      {children}
    </Stack>
  );
}

/** One quick-action tile (an icon + a short label) in a grid — Call/WhatsApp/Email/QR on the personal-professional templates, but generic enough for any short labeled action. */
export function ActionTile({
  tokens,
  icon,
  label,
  href,
}: {
  tokens: GlassTokens;
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Stack
      component="a"
      href={href}
      target={href.startsWith('tel:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      spacing={0.75}
      alignItems="center"
      justifyContent="center"
      sx={{
        textDecoration: 'none',
        color: tokens.onSurface,
        bgcolor: tokens.tileBg,
        border: tokens.tileBorder,
        boxShadow: tokens.tileShadow,
        backdropFilter: tokens.blur,
        borderRadius: tokens.tileRadius,
        py: 1.75,
        transition: 'transform 0.15s ease, background-color 0.15s ease',
        '&:hover': { bgcolor: tokens.tileHoverBg, transform: 'translateY(-2px)' },
        '&:active': { transform: 'scale(0.97)' },
      }}
    >
      {icon}
      <Typography variant="caption" fontWeight={600}>
        {label}
      </Typography>
    </Stack>
  );
}

/** One product/service card — image-forward, for the merchant-style templates' catalog grids (storefront, boutique). For a plain list-style menu row instead (no image), use PriceRow. */
export function CatalogCard({
  tokens,
  item,
  whatsappNumber,
}: {
  tokens: GlassTokens;
  item: CardCatalogItem;
  whatsappNumber?: string;
}) {
  return (
    <Stack
      sx={{
        bgcolor: tokens.tileBg,
        border: tokens.tileBorder,
        boxShadow: tokens.tileShadow,
        backdropFilter: tokens.blur,
        borderRadius: tokens.tileRadius,
        overflow: 'hidden',
      }}
    >
      {item.imageUrl ? (
        <Box
          component="img"
          src={item.imageUrl}
          alt={item.name}
          sx={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
        />
      ) : null}
      <Stack spacing={1} sx={{ p: 2 }}>
        <PriceRow name={item.name} description={item.description} price={item.price} />
        {whatsappNumber ? (
          <Button
            size="small"
            variant="outlined"
            component="a"
            href={toWhatsAppLink(whatsappNumber, `Hi, I'm interested in ${item.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              alignSelf: 'flex-start',
              textTransform: 'none',
              fontWeight: 600,
              color: tokens.primary,
              borderColor: tokens.primary,
              '&:hover': { borderColor: tokens.primary, bgcolor: `${tokens.primary}14` },
            }}
          >
            Inquire on WhatsApp
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}

/** An embedded Google Maps iframe (Card.mapEmbedUrl), framed the same as every other tile so it sits consistently among catalog/link sections. */
export function MapEmbed({ tokens, url }: { tokens: GlassTokens; url: string }) {
  return (
    <Box
      sx={{
        borderRadius: tokens.tileRadius,
        overflow: 'hidden',
        border: tokens.tileBorder,
        boxShadow: tokens.tileShadow,
        lineHeight: 0,
      }}
    >
      <Box
        component="iframe"
        src={url}
        title="Location map"
        loading="lazy"
        sx={{ width: '100%', height: 200, border: 0, display: 'block' }}
      />
    </Box>
  );
}

/**
 * A scannable UPI payment QR (Card.upiId) — a `upi://pay` deep link
 * encoded client-side via generateQrCodeDataUrl (@rdplatforms/utils).
 * Display only: no payment processing happens on our side, and no
 * amount is pre-filled — the customer's own UPI app fills that in.
 * Shared because at least two templates (WhatsApp Storefront,
 * Artisanal Jewelry Boutique) need it, not a one-off.
 */
export function UpiPaymentQr({
  tokens,
  upiId,
  payeeName,
}: {
  tokens: GlassTokens;
  upiId: string;
  payeeName: string;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    generateQrCodeDataUrl(
      `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}`,
    ).then((url) => {
      if (active) setDataUrl(url);
    });
    return () => {
      active = false;
    };
  }, [upiId, payeeName]);

  return (
    <Stack alignItems="center" spacing={1.5}>
      <Box
        sx={{
          width: 168,
          height: 168,
          borderRadius: tokens.tileRadius,
          border: tokens.tileBorder,
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {dataUrl ? (
          <Box
            component="img"
            src={dataUrl}
            alt="UPI payment QR"
            sx={{ width: '100%', height: '100%' }}
          />
        ) : (
          <CircularProgress size={24} />
        )}
      </Box>
      <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
        {upiId}
      </Typography>
    </Stack>
  );
}
