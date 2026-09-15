import { useEffect, useState, type ComponentType } from 'react';
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
  type SvgIconProps,
  type SxProps,
  type Theme,
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DirectionsIcon from '@mui/icons-material/Directions';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import StarIcon from '@mui/icons-material/Star';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import {
  generateQrCodeDataUrl,
  getAvatarColors,
  getInitials,
  toWhatsAppLink,
} from '@rdplatforms/utils';
import type {
  CardBadge,
  CardCatalogItem,
  CardHighlight,
  CardLink,
  CardStat,
  CardTestimonial,
} from '@rdplatforms/types';
import { hrefForLink, iconForLink, labelForLink } from '../linkPresentation';
import type { GlassTokens } from './designTokens';

/**
 * Building blocks every Milestone 9 template composes differently —
 * each one still owns its own overall structure and design tokens
 * (designTokens.ts), these are just the pieces worth sharing.
 */

/**
 * Renders the card's own QR code in a modal, generated on first open
 * (not eagerly — most visitors never tap it) via generateQrCodeDataUrl
 * (@rdplatforms/utils, Milestone 9). Deliberately style-agnostic beyond
 * the `sx` passed in: each Milestone 9 template hardcodes its own
 * design tokens (designTokens.ts) rather than going through a
 * swappable recolor system — see designTokens.ts's own comment.
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

type CatalogCtaStyle = { variant: 'contained' | 'outlined'; sx: object };

const CTA_TONE_SX: Record<
  NonNullable<CardCatalogItem['ctaTone']>,
  (t: GlassTokens) => CatalogCtaStyle
> = {
  solid: (tokens) => ({
    variant: 'contained',
    sx: {
      bgcolor: tokens.primary,
      color: tokens.onPrimary,
      '&:hover': { bgcolor: tokens.primary, opacity: 0.9 },
    },
  }),
  accent: (tokens) => ({
    variant: 'contained',
    sx: {
      bgcolor: tokens.secondary,
      color: tokens.onPrimary,
      '&:hover': { bgcolor: tokens.secondary, opacity: 0.9 },
    },
  }),
  outline: (tokens) => ({
    variant: 'outlined',
    sx: {
      color: tokens.primary,
      borderColor: tokens.primary,
      '&:hover': { borderColor: tokens.primary, bgcolor: `${tokens.primary}14` },
    },
  }),
};

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
  const cta = CTA_TONE_SX[item.ctaTone ?? 'outline'](tokens);

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
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={item.imageUrl}
            alt={item.name}
            sx={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }}
          />
          {item.badge ? (
            <Box
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                bgcolor: 'rgba(15, 15, 20, 0.72)',
                color: '#fff',
                borderRadius: 999,
                px: 1.25,
                py: 0.4,
              }}
            >
              <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: 0.3 }}>
                {item.badge.toUpperCase()}
              </Typography>
            </Box>
          ) : null}
        </Box>
      ) : null}
      <Stack spacing={1} sx={{ p: 2 }}>
        <PriceRow name={item.name} description={item.description} price={item.price} />
        {item.deliveryInfo ? (
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ opacity: 0.75 }}>
            <AccessTimeIcon sx={{ fontSize: 15 }} />
            <Typography variant="caption" color="inherit">
              {item.deliveryInfo}
            </Typography>
          </Stack>
        ) : null}
        {whatsappNumber ? (
          <Button
            size="small"
            variant={cta.variant}
            component="a"
            href={toWhatsAppLink(whatsappNumber, `Hi, I'm interested in ${item.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ alignSelf: 'flex-start', textTransform: 'none', fontWeight: 600, ...cta.sx }}
          >
            {item.ctaLabel ?? 'Inquire on WhatsApp'}
          </Button>
        ) : null}
      </Stack>
    </Stack>
  );
}

/**
 * An embedded Google Maps iframe (Card.mapEmbedUrl), framed the same as
 * every other tile so it sits consistently among catalog/link sections.
 * `venueName`/`address` are optional — when given, they render as a
 * header row above the map with a "Directions" link (a Google Maps
 * directions search built from `address`, not tied to `url`'s own
 * embed source).
 */
export function MapEmbed({
  tokens,
  url,
  venueName,
  address,
}: {
  tokens: GlassTokens;
  url: string;
  venueName?: string;
  address?: string;
}) {
  return (
    <Stack
      spacing={venueName || address ? 1.25 : 0}
      sx={{
        borderRadius: tokens.tileRadius,
        overflow: 'hidden',
        border: tokens.tileBorder,
        boxShadow: tokens.tileShadow,
      }}
    >
      {venueName || address ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          spacing={1}
          sx={{ bgcolor: tokens.tileBg, px: 2, pt: 1.5, pb: 1, color: tokens.onSurface }}
        >
          <Box sx={{ minWidth: 0 }}>
            {venueName ? (
              <Typography variant="body2" fontWeight={700} noWrap>
                {venueName}
              </Typography>
            ) : null}
            {address ? (
              <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
                {address}
              </Typography>
            ) : null}
          </Box>
          {address ? (
            <Stack
              component="a"
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`}
              target="_blank"
              rel="noopener noreferrer"
              direction="row"
              spacing={0.4}
              alignItems="center"
              sx={{ flexShrink: 0, textDecoration: 'none', color: tokens.primary }}
            >
              <DirectionsIcon sx={{ fontSize: 16 }} />
              <Typography variant="caption" fontWeight={700} color="inherit">
                Directions
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      ) : null}
      <Box sx={{ lineHeight: 0 }}>
        <Box
          component="iframe"
          src={url}
          title="Location map"
          loading="lazy"
          sx={{ width: '100%', height: 200, border: 0, display: 'block' }}
        />
      </Box>
    </Stack>
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
const ACCEPTED_PAYMENT_METHODS = ['Google Pay', 'PhonePe', 'Visa / Mastercard', 'NEFT / RTGS'];

export function UpiPaymentQr({
  tokens,
  upiId,
  payeeName,
  eyebrow,
}: {
  tokens: GlassTokens;
  upiId: string;
  payeeName: string;
  /** A short label above the QR, e.g. "Secure Instant Checkout". */
  eyebrow?: string;
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
      {eyebrow ? (
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{ color: tokens.primaryContainer, letterSpacing: 0.6 }}
        >
          {eyebrow.toUpperCase()}
        </Typography>
      ) : null}
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
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap justifyContent="center">
        {ACCEPTED_PAYMENT_METHODS.map((method) => (
          <Box
            key={method}
            sx={{
              bgcolor: tokens.tileBg,
              border: tokens.tileBorder,
              borderRadius: 999,
              px: 1.1,
              py: 0.3,
            }}
          >
            <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
              {method}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}

/** One quote/review — a star rating (if given), the quote, and the author's initials avatar + name/role. Shared since any template with real client feedback can use it, not just Creative Portfolio. */
export function TestimonialCard({
  tokens,
  testimonial,
}: {
  tokens: GlassTokens;
  testimonial: CardTestimonial;
}) {
  const avatarColors = getAvatarColors(testimonial.authorName);
  return (
    <Stack
      spacing={1.5}
      sx={{
        bgcolor: tokens.tileBg,
        border: tokens.tileBorder,
        boxShadow: tokens.tileShadow,
        backdropFilter: tokens.blur,
        borderRadius: tokens.tileRadius,
        p: 2.5,
      }}
    >
      {testimonial.rating ? (
        <Stack direction="row" spacing={0.25}>
          {Array.from({ length: 5 }).map((_, index) => (
            <StarIcon
              key={index}
              fontSize="small"
              sx={{
                color: tokens.primaryContainer,
                opacity: index < (testimonial.rating as number) ? 1 : 0.25,
              }}
            />
          ))}
        </Stack>
      ) : null}
      <Typography variant="body2" sx={{ color: tokens.onSurface, fontStyle: 'italic' }}>
        &ldquo;{testimonial.quote}&rdquo;
      </Typography>
      <Stack direction="row" spacing={1.25} alignItems="center">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            fontSize: 13,
            bgcolor: avatarColors.bg,
            color: avatarColors.fg,
          }}
        >
          {getInitials(testimonial.authorName)}
        </Avatar>
        <Stack>
          <Typography variant="caption" fontWeight={700} sx={{ color: tokens.onSurface }}>
            {testimonial.authorName}
          </Typography>
          {testimonial.authorRole ? (
            <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
              {testimonial.authorRole}
            </Typography>
          ) : null}
        </Stack>
      </Stack>
    </Stack>
  );
}

/** A list of link rows (icon + label), each its own tappable tile — the "Quick Links" pattern Executive Minimal and Dark Tech Glassmorphism both use for whatever CardLinks aren't already surfaced as a primary action elsewhere on the page. */
export function LinkRowList({ tokens, links }: { tokens: GlassTokens; links: CardLink[] }) {
  return (
    <Stack spacing={1}>
      {links.map((link, index) => {
        const Icon = iconForLink(link);
        return (
          <Stack
            key={`${link.type}-${index}`}
            component="a"
            href={hrefForLink(link)}
            target="_blank"
            rel="noopener noreferrer"
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              textDecoration: 'none',
              color: tokens.onSurface,
              bgcolor: tokens.tileBg,
              border: tokens.tileBorder,
              borderRadius: tokens.tileRadius * 0.75,
              p: 1.5,
              minWidth: 0,
              transition: 'background-color 0.15s ease',
              '&:hover': { bgcolor: tokens.tileHoverBg },
            }}
          >
            <IconButton
              size="small"
              component="span"
              sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: tokens.primary, flexShrink: 0 }}
            >
              <Icon fontSize="small" />
            </IconButton>
            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {labelForLink(link)}
              </Typography>
              {link.subtitle ? (
                <Typography variant="caption" noWrap sx={{ color: tokens.onSurfaceVariant }}>
                  {link.subtitle}
                </Typography>
              ) : null}
            </Box>
            <ChevronRightIcon
              sx={{ flexShrink: 0, color: tokens.onSurfaceVariant, opacity: 0.6 }}
            />
          </Stack>
        );
      })}
    </Stack>
  );
}

/**
 * A 2-column grid of CardLinks, each an icon square + the friendly
 * label + the raw value/handle underneath (e.g. "Instagram" /
 * "@ritesh.gear") — for the merchant-style templates' "Connect &
 * Follow" section, where showing the actual handle matters more than
 * it does in LinkRowList's icon-tile pattern.
 */
export function LinkValueGrid({ tokens, links }: { tokens: GlassTokens; links: CardLink[] }) {
  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 1.25 }}>
      {links.map((link, index) => {
        const Icon = iconForLink(link);
        return (
          <Stack
            key={`${link.type}-${index}`}
            component="a"
            href={hrefForLink(link)}
            target="_blank"
            rel="noopener noreferrer"
            direction="row"
            spacing={1.25}
            alignItems="center"
            sx={{
              textDecoration: 'none',
              color: tokens.onSurface,
              bgcolor: tokens.tileBg,
              border: tokens.tileBorder,
              borderRadius: tokens.tileRadius * 0.75,
              p: 1.25,
              minWidth: 0,
              overflow: 'hidden',
              transition: 'background-color 0.15s ease',
              '&:hover': { bgcolor: tokens.tileHoverBg },
            }}
          >
            <Box
              sx={{
                flexShrink: 0,
                width: 36,
                height: 36,
                borderRadius: tokens.tileRadius * 0.5,
                bgcolor: 'rgba(255,255,255,0.08)',
                color: tokens.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon fontSize="small" />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={700} noWrap>
                {labelForLink(link)}
              </Typography>
              <Typography variant="caption" noWrap sx={{ color: tokens.onSurfaceVariant }}>
                {link.value}
              </Typography>
            </Box>
          </Stack>
        );
      })}
    </Box>
  );
}

const HIGHLIGHT_ICONS: Record<NonNullable<CardHighlight['icon']>, ComponentType<SvgIconProps>> = {
  delivery: LocalShippingIcon,
  escrow: VerifiedUserIcon,
  reply: BoltIcon,
  check: CheckCircleIcon,
};

/** A row of small trust/fulfilment highlights (e.g. "Express Delivery", "Escrow Guaranteed") next to a merchant's primary contact actions. Wraps on narrow screens rather than scrolling. */
export function HighlightRow({
  tokens,
  highlights,
}: {
  tokens: GlassTokens;
  highlights: CardHighlight[];
}) {
  return (
    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap justifyContent="center">
      {highlights.map((highlight, index) => {
        const Icon = HIGHLIGHT_ICONS[highlight.icon ?? 'check'];
        return (
          <Stack
            key={`${highlight.label}-${index}`}
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ color: tokens.onSurfaceVariant }}
          >
            <Icon sx={{ fontSize: 15, color: tokens.primaryContainer }} />
            <Typography variant="caption" fontWeight={600} color="inherit">
              {highlight.label}
            </Typography>
          </Stack>
        );
      })}
    </Stack>
  );
}

/** A compact "★ 4.9 · 184 reviews" summary next to a merchant's verification badges. */
export function RatingSummary({
  tokens,
  rating,
}: {
  tokens: GlassTokens;
  rating: { value: number; count: number };
}) {
  return (
    <Stack direction="row" spacing={0.5} alignItems="center">
      <StarIcon sx={{ fontSize: 16, color: tokens.primaryContainer }} />
      <Typography variant="body2" fontWeight={700} color="inherit">
        {rating.value.toFixed(1)}
      </Typography>
      <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
        ({rating.count} reviews)
      </Typography>
    </Stack>
  );
}

/** An equal-width row of quantified achievements (Card.stats) — a big colored number over a short caption, e.g. "9+ / Yrs Exp". `minmax(0, 1fr)` (not bare `1fr`) so a track never grows past its share of the row just because one stat's text is longer — see LinkValueGrid's own note on this. */
export function StatRow({ tokens, stats }: { tokens: GlassTokens; stats: CardStat[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))`,
        gap: 1,
      }}
    >
      {stats.map((stat, index) => (
        <Stack key={`${stat.label}-${index}`} alignItems="center" spacing={0.25}>
          <Typography variant="h6" fontWeight={800} sx={{ color: tokens.primaryContainer }} noWrap>
            {stat.value}
          </Typography>
          <Typography
            variant="caption"
            noWrap
            sx={{ color: tokens.onSurfaceVariant, textTransform: 'uppercase', letterSpacing: 0.4 }}
          >
            {stat.label}
          </Typography>
        </Stack>
      ))}
    </Box>
  );
}

/** A row of circular icon actions, one per CardLink, label underneath — the "Chat / Behance / Dribbble / Insta / Email" pattern on the personal-professional templates that lead with several link types at once rather than one primary action. Wraps via `auto-fit` rather than a fixed column count, since the link list length varies per card. */
export function LinkActionGrid({ tokens, links }: { tokens: GlassTokens; links: CardLink[] }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(60px, 1fr))',
        gap: 1,
      }}
    >
      {links.map((link, index) => {
        const Icon = iconForLink(link);
        return (
          <Stack
            key={`${link.type}-${index}`}
            component="a"
            href={hrefForLink(link)}
            target="_blank"
            rel="noopener noreferrer"
            alignItems="center"
            spacing={0.5}
            sx={{ textDecoration: 'none', color: tokens.onSurface, minWidth: 0 }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                bgcolor: tokens.tileBg,
                border: tokens.tileBorder,
                color: tokens.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease',
                '&:hover': { bgcolor: tokens.tileHoverBg },
              }}
            >
              <Icon fontSize="small" />
            </Box>
            <Typography
              variant="caption"
              noWrap
              sx={{ color: tokens.onSurfaceVariant, maxWidth: '100%' }}
            >
              {labelForLink(link)}
            </Typography>
          </Stack>
        );
      })}
    </Box>
  );
}
