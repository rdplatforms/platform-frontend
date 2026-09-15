import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import IosShareIcon from '@mui/icons-material/IosShare';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { downloadVCard, getAvatarColors, getInitials, toWhatsAppLink } from '@rdplatforms/utils';
import {
  AmbientBackdrop,
  BadgeChip,
  CatalogCard,
  GlassSection,
  HighlightRow,
  LinkValueGrid,
  MapEmbed,
  RatingSummary,
  UpiPaymentQr,
} from './shared';
import { DARK_GLASS_TOKENS as tokens } from './designTokens';
import type { CardTemplateProps } from './types';

/** Dark, merchant/commerce-oriented — a catalog grid with per-item WhatsApp inquiries, UPI settlement, hours, and a map. Matches digital_business_card_platform/DESIGN.md's tokens, same as Executive Minimal. */
export function WhatsAppStorefrontTemplate({ card }: CardTemplateProps) {
  const avatarColors = getAvatarColors(card.name);
  const whatsappNumber =
    card.whatsapp ?? card.links.find((link) => link.type === 'whatsapp')?.value;
  const socialLinks = card.links.filter((link) => link.type !== 'call' && link.type !== 'whatsapp');

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

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        bgcolor: tokens.pageBackground,
        color: tokens.onSurface,
      }}
    >
      <AmbientBackdrop tokens={tokens} />

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 480, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={3}>
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
                  height: 96,
                  objectFit: 'cover',
                  display: 'block',
                  opacity: 0.85,
                }}
              />
            ) : null}
            <Avatar
              src={card.photoUrl || undefined}
              alt={card.name}
              sx={{
                width: 72,
                height: 72,
                mt: card.bannerUrl ? -6 : 0,
                bgcolor: avatarColors.bg,
                color: avatarColors.fg,
                fontWeight: 700,
                border: card.bannerUrl ? `3px solid ${tokens.panelBg}` : undefined,
              }}
            >
              {getInitials(card.name)}
            </Avatar>
            <Typography variant="h6" fontWeight={800}>
              {card.name}
            </Typography>
            {card.title ? (
              <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
                {card.title}
              </Typography>
            ) : null}
            {(card.badges && card.badges.length > 0) || card.rating ? (
              <Stack
                direction="row"
                spacing={1.25}
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
              >
                {card.badges?.map((badge, index) => (
                  <BadgeChip key={`${badge.label}-${index}`} badge={badge} />
                ))}
                {card.rating ? <RatingSummary tokens={tokens} rating={card.rating} /> : null}
              </Stack>
            ) : null}
            {card.highlights && card.highlights.length > 0 ? (
              <HighlightRow tokens={tokens} highlights={card.highlights} />
            ) : null}

            {whatsappNumber ? (
              <Button
                fullWidth
                size="large"
                startIcon={<WhatsAppIcon />}
                component="a"
                href={toWhatsAppLink(
                  whatsappNumber,
                  `Hi ${card.name}, I'd like to place an order.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  mt: 1,
                  py: 1.5,
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: 16,
                  bgcolor: tokens.secondary,
                  color: '#003824',
                  boxShadow: `0 12px 28px -8px ${tokens.secondary}88`,
                  '&:hover': { bgcolor: tokens.secondary, opacity: 0.9 },
                }}
              >
                Chat & Order on WhatsApp
              </Button>
            ) : null}

            <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
              {card.phone ? (
                <Button
                  fullWidth
                  startIcon={<CallIcon />}
                  component="a"
                  href={`tel:${card.phone}`}
                  sx={{
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 600,
                    color: tokens.onSurface,
                    border: tokens.tileBorder,
                    bgcolor: tokens.tileBg,
                    '&:hover': { bgcolor: tokens.tileHoverBg },
                  }}
                >
                  Call Business
                </Button>
              ) : null}
              <Button
                fullWidth
                startIcon={<IosShareIcon />}
                onClick={handleSaveContact}
                sx={{
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 600,
                  color: tokens.onSurface,
                  border: tokens.tileBorder,
                  bgcolor: tokens.tileBg,
                  '&:hover': { bgcolor: tokens.tileHoverBg },
                }}
              >
                Share V-Card
              </Button>
            </Stack>
          </GlassSection>

          {card.catalog && card.catalog.length > 0 ? (
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Catalogue & Packages
                  </Typography>
                  <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
                    Direct pricing via encrypted WhatsApp dispatch
                  </Typography>
                </Box>
                <Box
                  sx={{
                    flexShrink: 0,
                    bgcolor: `${tokens.primary}22`,
                    color: tokens.primaryContainer,
                    borderRadius: 999,
                    px: 1.25,
                    py: 0.4,
                  }}
                >
                  <Typography variant="caption" fontWeight={700}>
                    {card.catalog.length} ACTIVE
                  </Typography>
                </Box>
              </Stack>
              <Stack spacing={2}>
                {card.catalog.map((item) => (
                  <CatalogCard
                    key={item.id}
                    tokens={tokens}
                    item={item}
                    whatsappNumber={whatsappNumber}
                  />
                ))}
              </Stack>
            </Stack>
          ) : null}

          {card.hours && card.hours.length > 0 ? (
            <GlassSection tokens={tokens}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle2" fontWeight={700}>
                  Business Hours
                </Typography>
                {card.openNow ? (
                  <BadgeChip badge={{ label: 'Open Now', tone: 'available' }} />
                ) : null}
              </Stack>
              {card.hours.map((block) => (
                <Stack key={block.label} direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
                    {block.label}
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {block.value}
                  </Typography>
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

          {card.upiId ? (
            <GlassSection tokens={tokens} sx={{ alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={700}>
                Quick Merchant Settlement
              </Typography>
              <UpiPaymentQr
                tokens={tokens}
                upiId={card.upiId}
                payeeName={card.name}
                eyebrow="Secure Instant Checkout"
              />
            </GlassSection>
          ) : null}

          {socialLinks.length > 0 ? (
            <GlassSection tokens={tokens}>
              <Typography variant="subtitle2" fontWeight={700}>
                Connect & Follow
              </Typography>
              <LinkValueGrid tokens={tokens} links={socialLinks} />
            </GlassSection>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
