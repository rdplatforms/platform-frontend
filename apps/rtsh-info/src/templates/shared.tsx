import { useState } from 'react';
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
} from '@rdplatforms/utils';
import type { Card, CardBadge, CardLink } from '@rdplatforms/types';
import type { CardStyleConfig } from '../cardStyles';
import { hrefForLink, iconForLink, labelForLink } from '../linkPresentation';

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
