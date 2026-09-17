import { useState } from 'react';
import { Avatar, Box, Button, Collapse, IconButton, Stack, Typography } from '@mui/material';
import CallIcon from '@mui/icons-material/Call';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { downloadVCard, getAvatarColors, getInitials, toWhatsAppLink } from '@rdplatforms/utils';
import {
  BadgeChip,
  CatalogCard,
  GlassSection,
  HighlightTiles,
  MapEmbed,
  UpiPaymentQr,
} from './shared';
import { WARM_LUXURY_TOKENS as tokens } from './designTokens';
import type { CardTemplateProps } from './types';

/**
 * Light, warm luxury retail — matching artisanal_warm_luxury/DESIGN.md,
 * which explicitly rejects backdrop blur/heavy shadows and ambient glow
 * in favor of flat tonal layering ("avoids harsh synthetic
 * dropshadows... rejects aggressive bubble radii"), so this template
 * deliberately skips AmbientBackdrop/HeroMesh even though the dark
 * templates use them — that's the spec's own intent, not an oversight.
 */
export function ArtisanalJewelryBoutiqueTemplate({ card }: CardTemplateProps) {
  const avatarColors = getAvatarColors(card.name);
  const whatsappNumber =
    card.whatsapp ?? card.links.find((link) => link.type === 'whatsapp')?.value;
  const [showPaymentQr, setShowPaymentQr] = useState(false);

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
          <Stack
            spacing={1.5}
            sx={{
              bgcolor: `${tokens.primaryContainer}1a`,
              border: `1px solid ${tokens.primaryContainer}55`,
              borderRadius: tokens.panelRadius,
              p: 2.5,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <ContactPageIcon sx={{ fontSize: 18, color: tokens.primary }} />
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ color: tokens.primary, letterSpacing: 0.6 }}
              >
                QUICK SYNC
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
              Tap once to save {card.name} directly to your phone contacts — number, WhatsApp line,
              and store location all in one card.
            </Typography>
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
          </Stack>

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
            {card.badges && card.badges.length > 0 ? (
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                {card.badges.map((badge, index) => (
                  <BadgeChip key={`${badge.label}-${index}`} badge={badge} />
                ))}
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
              <Typography
                variant="body2"
                sx={{ color: tokens.onSurfaceVariant, fontStyle: 'italic' }}
              >
                {card.bio}
              </Typography>
            ) : null}

            {card.highlights && card.highlights.length > 0 ? (
              <Box sx={{ width: '100%' }}>
                <HighlightTiles tokens={tokens} highlights={card.highlights} />
              </Box>
            ) : null}

            <Stack direction="row" spacing={1.5} sx={{ width: '100%' }}>
              {card.phone ? (
                <Button
                  fullWidth
                  startIcon={<CallIcon />}
                  component="a"
                  href={`tel:${card.phone}`}
                  sx={{
                    borderRadius: tokens.panelRadius,
                    textTransform: 'none',
                    fontWeight: 600,
                    color: tokens.onSurface,
                    border: tokens.tileBorder,
                    bgcolor: tokens.tileBg,
                    '&:hover': { bgcolor: tokens.tileHoverBg },
                  }}
                >
                  Call Store
                </Button>
              ) : null}
              {whatsappNumber ? (
                <Button
                  fullWidth
                  startIcon={<WhatsAppIcon />}
                  component="a"
                  href={toWhatsAppLink(whatsappNumber, `Hi ${card.name}, I have an enquiry.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    borderRadius: tokens.panelRadius,
                    textTransform: 'none',
                    fontWeight: 600,
                    bgcolor: tokens.secondary,
                    color: '#fff',
                    '&:hover': { bgcolor: tokens.secondary, opacity: 0.9 },
                  }}
                >
                  WhatsApp
                </Button>
              ) : null}
            </Stack>
          </GlassSection>

          {card.catalog && card.catalog.length > 0 ? (
            <Stack spacing={1.5}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700}>
                  Curated Treasures
                </Typography>
                <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
                  Handcrafted pieces, available on request
                </Typography>
              </Box>
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
                  Boutique Hours
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
            <GlassSection tokens={tokens}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                onClick={() => setShowPaymentQr((open) => !open)}
                sx={{ cursor: 'pointer' }}
              >
                <Box>
                  <Typography variant="subtitle2" fontWeight={700}>
                    Instant Billing & UPI
                  </Typography>
                  <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
                    Tap to show the settlement QR for direct payment
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  sx={{
                    color: tokens.onSurfaceVariant,
                    transform: showPaymentQr ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.15s ease',
                  }}
                >
                  <ExpandMoreIcon />
                </IconButton>
              </Stack>
              <Collapse in={showPaymentQr}>
                <Box sx={{ pt: 1.5, display: 'flex', justifyContent: 'center' }}>
                  <UpiPaymentQr tokens={tokens} upiId={card.upiId} payeeName={card.name} />
                </Box>
              </Collapse>
            </GlassSection>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
