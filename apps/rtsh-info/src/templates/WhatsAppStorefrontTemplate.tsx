import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { getAvatarColors, getInitials, toWhatsAppLink } from '@rdplatforms/utils';
import {
  AmbientBackdrop,
  BadgeChip,
  CatalogCard,
  GlassSection,
  MapEmbed,
  UpiPaymentQr,
} from './shared';
import { DARK_GLASS_TOKENS as tokens } from './designTokens';
import { hrefForLink, iconForLink, labelForLink } from '../linkPresentation';
import type { CardTemplateProps } from './types';

/** Dark, merchant/commerce-oriented — a catalog grid with per-item WhatsApp inquiries, UPI settlement, hours, and a map. Matches digital_business_card_platform/DESIGN.md's tokens, same as Executive Minimal. */
export function WhatsAppStorefrontTemplate({ card }: CardTemplateProps) {
  const avatarColors = getAvatarColors(card.name);
  const whatsappNumber =
    card.whatsapp ?? card.links.find((link) => link.type === 'whatsapp')?.value;
  const socialLinks = card.links.filter((link) => link.type !== 'call' && link.type !== 'whatsapp');

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
            <Avatar
              src={card.photoUrl || undefined}
              alt={card.name}
              sx={{
                width: 72,
                height: 72,
                bgcolor: avatarColors.bg,
                color: avatarColors.fg,
                fontWeight: 700,
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
            {card.badges && card.badges.length > 0 ? (
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                {card.badges.map((badge, index) => (
                  <BadgeChip key={`${badge.label}-${index}`} badge={badge} />
                ))}
              </Stack>
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
                  Call
                </Button>
              ) : null}
            </Stack>
          </GlassSection>

          {card.catalog && card.catalog.length > 0 ? (
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" fontWeight={700}>
                Catalogue & Packages
              </Typography>
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
              <Typography variant="subtitle2" fontWeight={700}>
                Business Hours
              </Typography>
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

          {card.mapEmbedUrl ? <MapEmbed tokens={tokens} url={card.mapEmbedUrl} /> : null}

          {card.upiId ? (
            <GlassSection tokens={tokens} sx={{ alignItems: 'center' }}>
              <Typography variant="subtitle2" fontWeight={700}>
                Quick Merchant Settlement
              </Typography>
              <UpiPaymentQr tokens={tokens} upiId={card.upiId} payeeName={card.name} />
            </GlassSection>
          ) : null}

          {socialLinks.length > 0 ? (
            <GlassSection tokens={tokens}>
              <Typography variant="subtitle2" fontWeight={700}>
                Connect & Follow
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                {socialLinks.map((link, index) => {
                  const Icon = iconForLink(link);
                  return (
                    <Stack
                      key={`${link.type}-${index}`}
                      component="a"
                      href={hrefForLink(link)}
                      target="_blank"
                      rel="noopener noreferrer"
                      spacing={0.5}
                      alignItems="center"
                      sx={{
                        textDecoration: 'none',
                        color: tokens.onSurface,
                        bgcolor: tokens.tileBg,
                        border: tokens.tileBorder,
                        borderRadius: tokens.tileRadius,
                        py: 1.5,
                      }}
                    >
                      <Icon fontSize="small" />
                      <Typography variant="caption" noWrap>
                        {labelForLink(link)}
                      </Typography>
                    </Stack>
                  );
                })}
              </Box>
            </GlassSection>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
