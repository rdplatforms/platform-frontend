import { useState } from 'react';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DownloadIcon from '@mui/icons-material/Download';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { downloadVCard, getAvatarColors, getInitials, toWhatsAppLink } from '@rdplatforms/utils';
import {
  ActionTile,
  AmbientBackdrop,
  BadgeChip,
  GlassSection,
  LinkRowList,
  QrShareButton,
} from './shared';
import { DARK_GLASS_TOKENS as tokens } from './designTokens';
import type { CardTemplateProps } from './types';

/**
 * Dark, Web3/tech-flavored — a production-stack chip list (Card.skills)
 * and a lead-capture mini-form. The form has nowhere to submit to (no
 * accounts/backend, Milestone 9's whole scope), so — same fallback
 * every form-shaped thing in this platform uses when there's no
 * backend (Appointment/Contact/CartPage) — "Transmit Connection" builds
 * a WhatsApp message from what was typed and opens wa.me, rather than
 * being a dead button or requiring a backend to exist.
 */
export function DarkTechGlassmorphismTemplate({ card }: CardTemplateProps) {
  const avatarColors = getAvatarColors(card.name);
  const cardUrl = typeof window !== 'undefined' ? window.location.href : '';
  const whatsappNumber =
    card.whatsapp ?? card.links.find((link) => link.type === 'whatsapp')?.value;
  const bookingLink = card.links.find((link) => link.type === 'booking');
  const otherLinks = card.links.filter(
    (link) => link.type !== 'call' && link.type !== 'whatsapp' && link.type !== 'booking',
  );

  const [leadName, setLeadName] = useState('');
  const [leadContact, setLeadContact] = useState('');

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

  const handleTransmit = () => {
    if (!whatsappNumber || (!leadName && !leadContact)) return;
    const message = [
      `Hi ${card.name}, connecting via Card Viewer.`,
      leadName ? `Name: ${leadName}` : null,
      leadContact ? `Contact: ${leadContact}` : null,
    ]
      .filter(Boolean)
      .join('\n');
    window.open(toWhatsAppLink(whatsappNumber, message), '_blank', 'noopener,noreferrer');
    setLeadName('');
    setLeadContact('');
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

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: tokens.headerBg,
          backdropFilter: 'blur(24px)',
          borderBottom: tokens.panelBorder,
        }}
      >
        <Toolbar>
          <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1 }}>
            Card Viewer
          </Typography>
          <QrShareButton url={cardUrl} iconOnly sx={{ color: tokens.onSurfaceVariant }} />
        </Toolbar>
      </AppBar>

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 480, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={3}>
          <GlassSection tokens={tokens}>
            {card.badges && card.badges.length > 0 ? (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {card.badges.map((badge, index) => (
                  <BadgeChip key={`${badge.label}-${index}`} badge={badge} />
                ))}
              </Stack>
            ) : null}
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={card.photoUrl || undefined}
                  alt={card.name}
                  sx={{
                    width: 72,
                    height: 72,
                    bgcolor: avatarColors.bg,
                    color: avatarColors.fg,
                    fontWeight: 700,
                    border: `2px solid ${tokens.primary}`,
                  }}
                >
                  {getInitials(card.name)}
                </Avatar>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 2,
                    right: 2,
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    bgcolor: tokens.secondary,
                    border: `2px solid ${tokens.pageBackground}`,
                  }}
                />
              </Box>
              <Stack sx={{ minWidth: 0 }}>
                <Typography variant="h6" fontWeight={800} noWrap>
                  {card.name}
                </Typography>
                {card.title ? (
                  <Typography variant="body2" sx={{ color: tokens.primary }} noWrap>
                    {card.title}
                  </Typography>
                ) : null}
                {card.location ? (
                  <Typography variant="caption" sx={{ color: tokens.onSurfaceVariant }} noWrap>
                    {card.location}
                  </Typography>
                ) : null}
              </Stack>
            </Stack>
            {card.bio ? (
              <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
                {card.bio}
              </Typography>
            ) : null}
          </GlassSection>

          <Button
            fullWidth
            size="large"
            startIcon={<DownloadIcon />}
            onClick={handleSaveContact}
            sx={{
              py: 1.75,
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 16,
              background: `linear-gradient(135deg, ${tokens.primaryContainer}, #4F46E5)`,
              color: '#fff',
              boxShadow: `0 12px 28px -8px ${tokens.primaryContainer}88`,
            }}
          >
            Save VCF • Instant Contact Card
          </Button>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: whatsappNumber && bookingLink ? '1fr 1fr' : '1fr',
              gap: 1.5,
            }}
          >
            {whatsappNumber ? (
              <ActionTile
                tokens={tokens}
                icon={<WhatsAppIcon />}
                label="WhatsApp Ping"
                href={toWhatsAppLink(whatsappNumber)}
              />
            ) : null}
            {bookingLink ? (
              <ActionTile
                tokens={tokens}
                icon={<CalendarMonthIcon />}
                label={bookingLink.label ?? 'Book a Session'}
                href={bookingLink.value}
              />
            ) : null}
          </Box>

          {card.skills && card.skills.length > 0 ? (
            <GlassSection tokens={tokens}>
              <Typography variant="subtitle2" fontWeight={700}>
                Production Stack
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {card.skills.map((skill) => (
                  <Chip
                    key={skill}
                    label={skill}
                    size="small"
                    sx={{
                      bgcolor: tokens.tileBg,
                      border: tokens.tileBorder,
                      color: tokens.onSurface,
                      fontWeight: 600,
                    }}
                  />
                ))}
              </Stack>
            </GlassSection>
          ) : null}

          {otherLinks.length > 0 ? (
            <GlassSection tokens={tokens}>
              <Typography variant="subtitle2" fontWeight={700}>
                Verified Coordinates
              </Typography>
              <LinkRowList tokens={tokens} links={otherLinks} />
            </GlassSection>
          ) : null}

          {whatsappNumber ? (
            <GlassSection tokens={tokens}>
              <Typography variant="subtitle2" fontWeight={700}>
                Quick Ping Exchange
              </Typography>
              <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
                Leave your signal — opens WhatsApp with your details ready to send.
              </Typography>
              <TextField
                placeholder="Your Name or Alias"
                size="small"
                value={leadName}
                onChange={(event) => setLeadName(event.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: tokens.tileBg, color: tokens.onSurface },
                }}
              />
              <TextField
                placeholder="Email, Telegram, or Signal @"
                size="small"
                value={leadContact}
                onChange={(event) => setLeadContact(event.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': { bgcolor: tokens.tileBg, color: tokens.onSurface },
                }}
              />
              <Button
                fullWidth
                startIcon={<SendIcon />}
                onClick={handleTransmit}
                disabled={!leadName && !leadContact}
                sx={{
                  py: 1.25,
                  borderRadius: 999,
                  textTransform: 'none',
                  fontWeight: 700,
                  bgcolor: tokens.secondary,
                  color: '#003824',
                  '&:hover': { bgcolor: tokens.secondary, opacity: 0.9 },
                  '&.Mui-disabled': { opacity: 0.4, color: '#003824' },
                }}
              >
                Transmit Connection
              </Button>
            </GlassSection>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
