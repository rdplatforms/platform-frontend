import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import BadgeIcon from '@mui/icons-material/Badge';
import BusinessIcon from '@mui/icons-material/Business';
import CallIcon from '@mui/icons-material/Call';
import DownloadIcon from '@mui/icons-material/Download';
import EmailIcon from '@mui/icons-material/Email';
import VerifiedIcon from '@mui/icons-material/Verified';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { downloadVCard, getAvatarColors, getInitials, toWhatsAppLink } from '@rdplatforms/utils';
import {
  ActionTile,
  AmbientBackdrop,
  BadgeChip,
  GlassSection,
  HeroMesh,
  QrShareButton,
} from './shared';
import { DARK_GLASS_TOKENS as tokens } from './designTokens';
import { hrefForLink, iconForLink, labelForLink } from '../linkPresentation';
import type { CardTemplateProps } from './types';

export function ExecutiveMinimalTemplate({ card }: CardTemplateProps) {
  const avatarColors = getAvatarColors(card.name);
  const cardUrl = typeof window !== 'undefined' ? window.location.href : '';
  const isVerified = card.badges?.some((badge) => badge.tone === 'verified') ?? false;
  const whatsappNumber =
    card.whatsapp ?? card.links.find((link) => link.type === 'whatsapp')?.value;
  const otherLinks = card.links.filter((link) => link.type !== 'call' && link.type !== 'whatsapp');

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

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: tokens.headerBg,
          backdropFilter: 'blur(24px)',
          borderBottom: tokens.panelBorder,
          boxShadow: `0 24px 48px -8px rgba(0,0,0,0.7), 0 0 20px ${tokens.primaryContainer}33`,
        }}
      >
        <Toolbar>
          <BadgeIcon sx={{ color: tokens.primary, mr: 1 }} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1 }}>
            Card Viewer
          </Typography>
          <QrShareButton url={cardUrl} iconOnly sx={{ color: tokens.onSurfaceVariant }} />
        </Toolbar>
      </AppBar>

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 480, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={3}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: tokens.panelRadius,
              bgcolor: tokens.panelBg,
              backdropFilter: tokens.blur,
              border: tokens.panelBorder,
              boxShadow: tokens.panelShadow,
              p: 3,
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            <HeroMesh tokens={tokens} />
            <Box sx={{ position: 'relative' }}>
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
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
                {isVerified ? (
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: tokens.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `3px solid ${tokens.pageBackground}`,
                      boxShadow: `0 0 12px ${tokens.primary}88`,
                    }}
                  >
                    <VerifiedIcon sx={{ fontSize: 16, color: tokens.onPrimary }} />
                  </Box>
                ) : null}
              </Box>
              <Typography variant="h5" fontWeight={800}>
                {card.name}
              </Typography>
              {card.title ? (
                <Typography variant="body1" sx={{ color: tokens.onSurfaceVariant, mt: 0.5 }}>
                  {card.title}
                </Typography>
              ) : null}
              {card.category ? (
                <Stack
                  direction="row"
                  spacing={0.5}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ color: tokens.onSurfaceVariant, mt: 1 }}
                >
                  <BusinessIcon fontSize="small" />
                  <Typography variant="body2">{card.category}</Typography>
                </Stack>
              ) : null}
              {card.badges && card.badges.length > 0 ? (
                <Stack
                  direction="row"
                  spacing={1}
                  justifyContent="center"
                  flexWrap="wrap"
                  useFlexGap
                  sx={{ mt: 2 }}
                >
                  {card.badges.map((badge, index) => (
                    <BadgeChip key={`${badge.label}-${index}`} badge={badge} />
                  ))}
                </Stack>
              ) : null}
            </Box>
          </Box>

          <Button
            fullWidth
            size="large"
            startIcon={<DownloadIcon />}
            onClick={handleSaveContact}
            sx={{
              position: 'relative',
              overflow: 'hidden',
              py: 1.75,
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 16,
              background: `linear-gradient(135deg, ${tokens.primaryContainer}, #4F46E5)`,
              color: '#fff',
              boxShadow: `0 12px 28px -8px ${tokens.primaryContainer}88`,
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent 55%)',
                pointerEvents: 'none',
              },
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: `0 0 24px ${tokens.primaryContainer}66, 0 12px 28px -8px ${tokens.primaryContainer}aa`,
              },
            }}
          >
            Save Contact (.vcf)
          </Button>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
            {card.phone ? (
              <ActionTile
                tokens={tokens}
                icon={<CallIcon />}
                label="Call"
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
            {card.email ? (
              <ActionTile
                tokens={tokens}
                icon={<EmailIcon />}
                label="Email"
                href={`mailto:${card.email}`}
              />
            ) : null}
            <QrShareButton
              url={cardUrl}
              iconOnly
              label="QR Code"
              sx={{
                width: '100%',
                height: '100%',
                minHeight: 68,
                borderRadius: tokens.tileRadius,
                bgcolor: tokens.tileBg,
                border: tokens.tileBorder,
                boxShadow: tokens.tileShadow,
                backdropFilter: tokens.blur,
                color: tokens.onSurface,
                flexDirection: 'column',
                gap: 0.5,
                transition: 'transform 0.15s ease',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            />
          </Box>

          {card.bio ? (
            <GlassSection tokens={tokens}>
              <Typography variant="subtitle2" fontWeight={700}>
                About
              </Typography>
              <Typography variant="body2" sx={{ color: tokens.onSurfaceVariant }}>
                {card.bio}
              </Typography>
              {card.skills && card.skills.length > 0 ? (
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
              ) : null}
            </GlassSection>
          ) : null}

          {otherLinks.length > 0 ? (
            <GlassSection tokens={tokens}>
              <Typography variant="subtitle2" fontWeight={700}>
                Quick Links & Channels
              </Typography>
              <Stack spacing={1}>
                {otherLinks.map((link, index) => {
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
                        transition: 'background-color 0.15s ease',
                        '&:hover': { bgcolor: tokens.tileHoverBg },
                      }}
                    >
                      <IconButton
                        size="small"
                        component="span"
                        sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: tokens.primary }}
                      >
                        <Icon fontSize="small" />
                      </IconButton>
                      <Typography variant="body2" fontWeight={600}>
                        {labelForLink(link)}
                      </Typography>
                    </Stack>
                  );
                })}
              </Stack>
            </GlassSection>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
