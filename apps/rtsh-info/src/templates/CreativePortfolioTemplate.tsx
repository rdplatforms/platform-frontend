import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadIcon from '@mui/icons-material/Download';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import { downloadVCard, getAvatarColors, getInitials } from '@rdplatforms/utils';
import {
  AmbientBackdrop,
  BadgeChip,
  CatalogCard,
  GlassSection,
  LinkActionGrid,
  StatRow,
  TestimonialCard,
} from './shared';
import { DARK_GLASS_TOKENS as tokens } from './designTokens';
import type { CardTemplateProps } from './types';

/** Dark, personal-professional — a featured-work grid and client testimonials, for designers/creatives who lead with a portfolio rather than a contact/company line. Same digital_business_card_platform/DESIGN.md tokens as Executive Minimal/WhatsApp Storefront. */
export function CreativePortfolioTemplate({ card }: CardTemplateProps) {
  const avatarColors = getAvatarColors(card.name);
  const downloadLink = card.links.find((link) => link.type === 'download');
  const actionLinks = card.links.filter((link) => link.type !== 'download');

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
            {card.badges && card.badges.length > 0 ? (
              <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" useFlexGap>
                {card.badges.map((badge, index) => (
                  <BadgeChip key={`${badge.label}-${index}`} badge={badge} />
                ))}
              </Stack>
            ) : null}

            <Avatar
              src={card.photoUrl || undefined}
              alt={card.name}
              sx={{
                width: 96,
                height: 96,
                bgcolor: avatarColors.bg,
                color: avatarColors.fg,
                fontSize: 32,
                fontWeight: 700,
                boxShadow: `0 0 0 4px ${tokens.primary}26, 0 8px 24px -6px rgba(0,0,0,0.5)`,
              }}
            >
              {getInitials(card.name)}
            </Avatar>
            {card.handle ? (
              <Typography
                variant="caption"
                fontWeight={700}
                sx={{ color: tokens.primaryContainer, letterSpacing: 0.3 }}
              >
                {card.handle}
              </Typography>
            ) : null}
            <Typography variant="h5" fontWeight={800}>
              {card.name}
            </Typography>
            {card.title ? (
              <Typography variant="body1" sx={{ color: tokens.onSurfaceVariant }}>
                {card.title}
              </Typography>
            ) : null}

            {card.stats && card.stats.length > 0 ? (
              <Box sx={{ width: '100%', pt: 1 }}>
                <StatRow tokens={tokens} stats={card.stats} />
              </Box>
            ) : null}

            {actionLinks.length > 0 ? (
              <Box sx={{ width: '100%' }}>
                <LinkActionGrid tokens={tokens} links={actionLinks} />
              </Box>
            ) : null}

            <Stack direction="row" spacing={1.5} sx={{ width: '100%', mt: 1 }}>
              <Button
                fullWidth
                startIcon={<DownloadForOfflineIcon />}
                onClick={handleSaveContact}
                sx={{
                  py: 1.25,
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  background: `linear-gradient(135deg, ${tokens.primaryContainer}, #4F46E5)`,
                  color: '#fff',
                  boxShadow: `0 12px 28px -8px ${tokens.primaryContainer}88`,
                }}
              >
                Save Contact
              </Button>
              {downloadLink ? (
                <Button
                  fullWidth
                  startIcon={<DownloadIcon />}
                  component="a"
                  href={downloadLink.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    py: 1.25,
                    borderRadius: 999,
                    textTransform: 'none',
                    fontWeight: 700,
                    color: tokens.onSurface,
                    border: tokens.tileBorder,
                    bgcolor: tokens.tileBg,
                    '&:hover': { bgcolor: tokens.tileHoverBg },
                  }}
                >
                  {downloadLink.label ?? 'Press Kit & CV'}
                </Button>
              ) : null}
            </Stack>
          </GlassSection>

          {card.bio ? (
            <GlassSection tokens={tokens}>
              <Typography variant="subtitle2" fontWeight={700}>
                About
              </Typography>
              <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
                {card.bio}
              </Typography>
            </GlassSection>
          ) : null}

          {card.catalog && card.catalog.length > 0 ? (
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <AutoAwesomeIcon sx={{ fontSize: 18, color: tokens.primaryContainer }} />
                  <Typography variant="subtitle2" fontWeight={700}>
                    Featured Works
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }}>
                  Archive ({card.catalog.length})
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {card.catalog.map((item) => (
                  <CatalogCard key={item.id} tokens={tokens} item={item} />
                ))}
              </Stack>
            </Stack>
          ) : null}

          {card.testimonials && card.testimonials.length > 0 ? (
            <Stack spacing={1.5}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <FormatQuoteIcon sx={{ fontSize: 18, color: tokens.primaryContainer }} />
                <Typography variant="subtitle2" fontWeight={700}>
                  Client Words
                </Typography>
              </Stack>
              <Stack spacing={2}>
                {card.testimonials.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} tokens={tokens} testimonial={testimonial} />
                ))}
              </Stack>
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
