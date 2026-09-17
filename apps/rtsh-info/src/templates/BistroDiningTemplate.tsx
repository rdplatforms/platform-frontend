import { Avatar, Box, Button, Chip, Stack, Typography } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DirectionsIcon from '@mui/icons-material/Directions';
import DownloadIcon from '@mui/icons-material/Download';
import RateReviewIcon from '@mui/icons-material/RateReview';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { downloadVCard, getAvatarColors, getInitials, toWhatsAppLink } from '@rdplatforms/utils';
import {
  ActionTile,
  BadgeChip,
  CatalogCard,
  GlassSection,
  HighlightRow,
  MapEmbed,
  RatingSummary,
} from './shared';
import { WARM_LUXURY_TOKENS as tokens } from './designTokens';
import type { CardTemplateProps } from './types';

/** Light, warm dining — reuses the same WARM_LUXURY_TOKENS as Artisanal Jewelry Boutique (no blur/ambient glow, per artisanal_warm_luxury/DESIGN.md). Menu items reuse CatalogCard; hours reuse Card.hours' multi-block shape (lunch/dinner as two separate rows). */
export function BistroDiningTemplate({ card }: CardTemplateProps) {
  const avatarColors = getAvatarColors(card.name);
  const whatsappNumber =
    card.whatsapp ?? card.links.find((link) => link.type === 'whatsapp')?.value;
  const bookingLink = card.links.find((link) => link.type === 'booking');

  const handleSaveContact = () => {
    downloadVCard(
      {
        name: card.name,
        title: card.title,
        phone: card.phone,
        whatsapp: card.whatsapp,
        email: card.email,
        address: card.location,
      },
      `${card.name.replace(/\s+/g, '-')}.vcf`,
    );
  };

  const handleCopyInfo = () => {
    const lines = [card.name, card.phone, card.email, card.location].filter(Boolean);
    navigator.clipboard?.writeText(lines.join('\n'));
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: tokens.pageBackground, color: tokens.onSurface }}>
      <Box sx={{ maxWidth: 480, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={3}>
          <Stack
            spacing={1.5}
            sx={{
              bgcolor: `${tokens.primaryContainer}1a`,
              border: `1px solid ${tokens.primaryContainer}55`,
              borderRadius: tokens.panelRadius,
              p: 2.5,
            }}
          >
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ color: tokens.primary, letterSpacing: 0.6 }}
            >
              QUICK ACCESS PASS
            </Typography>
            <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
              Save {card.name} to your phone contacts for instant table bookings and priority
              WhatsApp takeout.
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                fullWidth
                startIcon={<DownloadIcon />}
                onClick={handleSaveContact}
                sx={{
                  py: 1.25,
                  borderRadius: tokens.panelRadius,
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: tokens.onSurface,
                  color: tokens.pageBackground,
                  '&:hover': { bgcolor: tokens.secondary },
                }}
              >
                Save to Contacts
              </Button>
              <Button
                fullWidth
                startIcon={<ContentCopyIcon />}
                onClick={handleCopyInfo}
                sx={{
                  py: 1.25,
                  borderRadius: tokens.panelRadius,
                  textTransform: 'none',
                  fontWeight: 700,
                  color: tokens.onSurface,
                  border: tokens.tileBorder,
                  bgcolor: tokens.tileBg,
                  '&:hover': { bgcolor: tokens.tileHoverBg },
                }}
              >
                Copy Info
              </Button>
            </Stack>
          </Stack>

          <GlassSection tokens={tokens} sx={{ alignItems: 'center', textAlign: 'center' }}>
            {card.bannerUrl ? (
              <Box
                component="img"
                src={card.bannerUrl}
                alt=""
                sx={{
                  width: `calc(100% + 40px)`,
                  mx: -2.5,
                  mt: -2.5,
                  height: 110,
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
            ) : null}
            <Avatar
              src={card.photoUrl || undefined}
              alt={card.name}
              sx={{
                width: 80,
                height: 80,
                mt: card.bannerUrl ? -7 : 0,
                bgcolor: avatarColors.bg,
                color: avatarColors.fg,
                fontWeight: 700,
                border: `3px solid ${tokens.panelBg}`,
                boxShadow: `0 0 0 1px ${tokens.primaryContainer}`,
              }}
            >
              {getInitials(card.name)}
            </Avatar>

            {card.openNow || (card.badges && card.badges.length > 0) || card.rating ? (
              <Stack
                direction="row"
                spacing={1.25}
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                {card.openNow ? (
                  <BadgeChip badge={{ label: 'Open Now', tone: 'available' }} />
                ) : null}
                {card.badges?.map((badge, index) => (
                  <BadgeChip key={`${badge.label}-${index}`} badge={badge} />
                ))}
                {card.rating ? <RatingSummary tokens={tokens} rating={card.rating} /> : null}
              </Stack>
            ) : null}

            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: 'serif' }}>
              {card.name}
            </Typography>
            {card.category ? (
              <Typography
                variant="overline"
                sx={{ color: tokens.secondary, letterSpacing: '0.08em', fontWeight: 700 }}
              >
                {card.category}
              </Typography>
            ) : null}
            {card.bio ? (
              <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
                {card.bio}
              </Typography>
            ) : null}
            {card.skills && card.skills.length > 0 ? (
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                {card.skills.map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    sx={{
                      bgcolor: tokens.tileBg,
                      border: tokens.tileBorder,
                      color: tokens.onSurface,
                    }}
                  />
                ))}
              </Stack>
            ) : null}

            {card.highlights && card.highlights.length > 0 ? (
              <HighlightRow tokens={tokens} highlights={card.highlights} />
            ) : null}

            <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
              {bookingLink ? (
                <Button
                  fullWidth
                  startIcon={<CalendarMonthIcon />}
                  component="a"
                  href={bookingLink.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderRadius: tokens.panelRadius,
                    textTransform: 'none',
                    fontWeight: 700,
                    bgcolor: tokens.onSurface,
                    color: tokens.pageBackground,
                    '&:hover': { bgcolor: tokens.secondary },
                  }}
                >
                  {bookingLink.label ?? 'Reserve a Table'}
                </Button>
              ) : null}
              {whatsappNumber ? (
                <Button
                  fullWidth
                  startIcon={<WhatsAppIcon />}
                  component="a"
                  href={toWhatsAppLink(
                    whatsappNumber,
                    `Hi ${card.name}, I'd like to place a pickup order.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderRadius: tokens.panelRadius,
                    textTransform: 'none',
                    fontWeight: 700,
                    bgcolor: tokens.secondary,
                    color: '#fff',
                    '&:hover': { bgcolor: tokens.secondary, opacity: 0.9 },
                  }}
                >
                  Order via WhatsApp
                </Button>
              ) : null}
            </Stack>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
                gap: 1.5,
                width: '100%',
              }}
            >
              {card.phone ? (
                <ActionTile
                  tokens={tokens}
                  icon={<CallIcon />}
                  label="Call Bistro"
                  href={`tel:${card.phone}`}
                />
              ) : null}
              {whatsappNumber ? (
                <ActionTile
                  tokens={tokens}
                  icon={<WhatsAppIcon />}
                  label="WhatsApp"
                  href={toWhatsAppLink(whatsappNumber)}
                />
              ) : null}
              {card.location ? (
                <ActionTile
                  tokens={tokens}
                  icon={<DirectionsIcon />}
                  label="Directions"
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(card.location)}`}
                />
              ) : null}
            </Box>
          </GlassSection>

          {card.catalog && card.catalog.length > 0 ? (
            <Stack spacing={1.5}>
              <Box>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ color: tokens.secondary, letterSpacing: 0.6 }}
                >
                  CHEF&apos;S RECOMMENDATIONS
                </Typography>
                <Typography variant="subtitle2" fontWeight={700}>
                  Chef&apos;s Selections
                </Typography>
              </Box>
              <Stack spacing={2}>
                {card.catalog.map((item) => (
                  <CatalogCard
                    key={item.id}
                    tokens={tokens}
                    item={item}
                    whatsappNumber={whatsappNumber}
                    defaultCtaLabel="Order for Pickup via WhatsApp"
                  />
                ))}
              </Stack>
            </Stack>
          ) : null}

          {card.reviewUrl ? (
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              component="a"
              href={card.reviewUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: 'none',
                color: tokens.onSurface,
                bgcolor: `${tokens.primaryContainer}1a`,
                border: `1px solid ${tokens.primaryContainer}55`,
                borderRadius: tokens.panelRadius,
                p: 2,
              }}
            >
              <RateReviewIcon sx={{ color: tokens.primary }} />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" fontWeight={700}>
                  Loved your meal today?
                </Typography>
                <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
                  Tap to share a review on Google
                </Typography>
              </Box>
            </Stack>
          ) : null}

          {card.hours && card.hours.length > 0 ? (
            <GlassSection tokens={tokens}>
              <Typography variant="subtitle2" fontWeight={700}>
                Service Hours
              </Typography>
              {card.hours.map((block) => (
                <Stack key={block.label} spacing={0.25}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" fontWeight={700}>
                      {block.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {block.value}
                    </Typography>
                  </Stack>
                  {block.note ? (
                    <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
                      {block.note}
                    </Typography>
                  ) : null}
                </Stack>
              ))}
            </GlassSection>
          ) : null}

          {card.mapEmbedUrl ? (
            <MapEmbed
              tokens={tokens}
              url={card.mapEmbedUrl}
              venueName={card.locationName}
              address={card.location}
            />
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
