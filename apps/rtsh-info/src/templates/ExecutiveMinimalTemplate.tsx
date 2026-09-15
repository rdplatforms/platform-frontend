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
import { BadgeChip, QrShareButton } from './shared';
import { hrefForLink, iconForLink, labelForLink } from '../linkPresentation';
import type { CardTemplateProps } from './types';

/**
 * Colors/spacing lifted directly from
 * stitch_digital_business_card_platform/digital_business_card_platform/DESIGN.md
 * — hardcoded here rather than going through CardStyleConfig, since this
 * design has its own deliberate palette (see shared.tsx's QrShareButton
 * comment for why Milestone 9 templates don't use the old style system).
 */
const TOKENS = {
  background: '#0b1326',
  surfaceContainer: '#171f33',
  onSurface: '#dae2fd',
  onSurfaceVariant: '#c7c4d7',
  primary: '#c0c1ff',
  onPrimary: '#1000a9',
  secondary: '#4edea3',
};

function ActionTile({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) {
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
        color: TOKENS.onSurface,
        bgcolor: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 3,
        py: 1.5,
      }}
    >
      {icon}
      <Typography variant="caption" fontWeight={600}>
        {label}
      </Typography>
    </Stack>
  );
}

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
    <Box sx={{ minHeight: '100vh', bgcolor: TOKENS.background, color: TOKENS.onSurface }}>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'rgba(11,19,38,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <Toolbar>
          <BadgeIcon sx={{ color: TOKENS.primary, mr: 1 }} />
          <Typography variant="subtitle1" fontWeight={700} sx={{ flexGrow: 1 }}>
            Card Viewer
          </Typography>
          <QrShareButton url={cardUrl} iconOnly sx={{ color: TOKENS.onSurfaceVariant }} />
        </Toolbar>
      </AppBar>

      <Box sx={{ maxWidth: 480, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={3}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 4,
              bgcolor: TOKENS.surfaceContainer,
              p: 3,
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 0,
                opacity: 0.35,
                background: `radial-gradient(circle at 85% 10%, ${TOKENS.primary}44, transparent 60%), radial-gradient(circle at 10% 70%, ${TOKENS.secondary}33, transparent 55%)`,
                pointerEvents: 'none',
              }}
            />
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
                      bgcolor: TOKENS.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `3px solid ${TOKENS.surfaceContainer}`,
                    }}
                  >
                    <VerifiedIcon sx={{ fontSize: 16, color: TOKENS.onPrimary }} />
                  </Box>
                ) : null}
              </Box>
              <Typography variant="h5" fontWeight={800}>
                {card.name}
              </Typography>
              {card.title ? (
                <Typography variant="body1" sx={{ color: TOKENS.onSurfaceVariant, mt: 0.5 }}>
                  {card.title}
                </Typography>
              ) : null}
              {card.category ? (
                <Stack
                  direction="row"
                  spacing={0.5}
                  justifyContent="center"
                  alignItems="center"
                  sx={{ color: TOKENS.onSurfaceVariant, mt: 1 }}
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
              py: 1.75,
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 16,
              background: `linear-gradient(135deg, ${TOKENS.primary}, #4F46E5)`,
              color: '#fff',
              boxShadow: 'none',
              '&:hover': { boxShadow: `0 0 24px ${TOKENS.primary}66` },
            }}
          >
            Save Contact (.vcf)
          </Button>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1.5 }}>
            {card.phone ? (
              <ActionTile icon={<CallIcon />} label="Call" href={`tel:${card.phone}`} />
            ) : null}
            {whatsappNumber ? (
              <ActionTile
                icon={<WhatsAppIcon />}
                label="WhatsApp"
                href={toWhatsAppLink(whatsappNumber)}
              />
            ) : null}
            {card.email ? (
              <ActionTile icon={<EmailIcon />} label="Email" href={`mailto:${card.email}`} />
            ) : null}
            <QrShareButton
              url={cardUrl}
              iconOnly
              label="QR Code"
              sx={{
                width: '100%',
                height: '100%',
                borderRadius: 3,
                bgcolor: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: TOKENS.onSurface,
                flexDirection: 'column',
                gap: 0.5,
              }}
            />
          </Box>

          {card.bio ? (
            <Stack spacing={1.5} sx={{ bgcolor: TOKENS.surfaceContainer, borderRadius: 3, p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={700}>
                About
              </Typography>
              <Typography variant="body2" sx={{ color: TOKENS.onSurfaceVariant }}>
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
                        bgcolor: 'rgba(255,255,255,0.08)',
                        color: TOKENS.onSurface,
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Stack>
              ) : null}
            </Stack>
          ) : null}

          {otherLinks.length > 0 ? (
            <Stack spacing={1.5} sx={{ bgcolor: TOKENS.surfaceContainer, borderRadius: 3, p: 2.5 }}>
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
                        color: TOKENS.onSurface,
                        bgcolor: 'rgba(255,255,255,0.04)',
                        borderRadius: 2,
                        p: 1.5,
                      }}
                    >
                      <IconButton
                        size="small"
                        component="span"
                        sx={{ bgcolor: 'rgba(255,255,255,0.08)', color: TOKENS.primary }}
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
            </Stack>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
