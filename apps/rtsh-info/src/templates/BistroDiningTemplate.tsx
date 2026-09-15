import { Avatar, Box, Button, Chip, Stack, Typography } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DownloadIcon from '@mui/icons-material/Download';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { downloadVCard, getAvatarColors, getInitials, toWhatsAppLink } from '@rdplatforms/utils';
import { BadgeChip, CatalogCard, GlassSection, MapEmbed } from './shared';
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: tokens.pageBackground, color: tokens.onSurface }}>
      <Box sx={{ maxWidth: 480, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={3}>
          <Button
            fullWidth
            size="large"
            startIcon={<DownloadIcon />}
            onClick={handleSaveContact}
            sx={{
              py: 1.5,
              borderRadius: tokens.panelRadius,
              textTransform: 'none',
              fontWeight: 700,
              bgcolor: tokens.onSurface,
              color: tokens.pageBackground,
              '&:hover': { bgcolor: tokens.secondary },
            }}
          >
            Save to Contacts (.vcf)
          </Button>

          <GlassSection tokens={tokens} sx={{ alignItems: 'center', textAlign: 'center' }}>
            <Avatar
              src={card.photoUrl || undefined}
              alt={card.name}
              sx={{
                width: 80,
                height: 80,
                bgcolor: avatarColors.bg,
                color: avatarColors.fg,
                fontWeight: 700,
                border: `2px solid ${tokens.primaryContainer}`,
              }}
            >
              {getInitials(card.name)}
            </Avatar>
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
            {card.badges && card.badges.length > 0 ? (
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                {card.badges.map((badge, index) => (
                  <BadgeChip key={`${badge.label}-${index}`} badge={badge} />
                ))}
              </Stack>
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
          </GlassSection>

          {card.catalog && card.catalog.length > 0 ? (
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" fontWeight={700}>
                Chef's Selections
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
                Service Hours
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
        </Stack>
      </Box>
    </Box>
  );
}
