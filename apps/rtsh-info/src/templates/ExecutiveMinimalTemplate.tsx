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
 * Colors lifted directly from
 * stitch_digital_business_card_platform/digital_business_card_platform/DESIGN.md
 * — hardcoded here rather than going through CardStyleConfig, since this
 * design has its own deliberate palette (see shared.tsx's QrShareButton
 * comment for why Milestone 9 templates don't use the old style system).
 *
 * The elevation values (glassBg/glassBorder/glassShadow, tileBg/tileBorder)
 * are taken from the spec's own "Glass Shell" / "Elevated Nodes" recipe —
 * translucent background + backdrop-filter + a light-catch rim border +
 * a soft directional shadow, not a flat fill. That layering is what reads
 * as "tactile glassmorphism" rather than a plain dark theme.
 */
const TOKENS = {
  pageBackground: '#090d16',
  glassBg: 'rgba(15, 23, 42, 0.75)',
  glassBorder: '1px solid rgba(255,255,255,0.09)',
  glassShadow: '0 20px 40px -15px rgba(0,0,0,0.5)',
  tileBg: 'rgba(30, 41, 59, 0.6)',
  tileBorder: '1px solid rgba(255,255,255,0.12)',
  tileShadow: '0 8px 24px -6px rgba(0,0,0,0.35)',
  headerBg: 'rgba(15, 23, 42, 0.9)',
  onSurface: '#dae2fd',
  onSurfaceVariant: '#c7c4d7',
  primary: '#c0c1ff',
  primaryContainer: '#8083ff',
  onPrimary: '#1000a9',
  secondary: '#4edea3',
  indigoGlow: '#494bd6',
};

/** Two large, slow ambient light sources behind the whole page (DESIGN.md's "Base Layer") — not just a subtle tint inside the hero card. */
function AmbientBackdrop() {
  return (
    <Box sx={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      <Box
        sx={{
          position: 'absolute',
          top: -120,
          right: -100,
          width: 420,
          height: 420,
          borderRadius: '50%',
          bgcolor: TOKENS.indigoGlow,
          opacity: 0.25,
          filter: 'blur(120px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -140,
          left: -100,
          width: 380,
          height: 380,
          borderRadius: '50%',
          bgcolor: TOKENS.secondary,
          opacity: 0.15,
          filter: 'blur(120px)',
        }}
      />
    </Box>
  );
}

/** The geometric mesh line-art behind the hero card — ported directly from the Stitch reference markup (template_1_executive_minimal/code.html), not an approximation of it. */
function HeroMesh() {
  return (
    <Box
      component="svg"
      viewBox="0 0 400 320"
      sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.4 }}
    >
      <circle cx="340" cy="40" r="140" fill={TOKENS.indigoGlow} opacity="0.35" />
      <circle cx="50" cy="180" r="120" fill={TOKENS.secondary} opacity="0.2" />
      <path
        d="M-20 60 L180 20 L240 160 L40 220 Z"
        stroke={TOKENS.primary}
        strokeWidth="0.75"
        strokeDasharray="4 6"
        opacity="0.4"
        fill="none"
      />
      <path
        d="M120 -10 L380 90 L310 260 L90 190 Z"
        stroke="#ffb95f"
        strokeWidth="0.5"
        strokeDasharray="3 5"
        opacity="0.3"
        fill="none"
      />
    </Box>
  );
}

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
        bgcolor: TOKENS.tileBg,
        border: TOKENS.tileBorder,
        boxShadow: TOKENS.tileShadow,
        backdropFilter: 'blur(12px)',
        borderRadius: 3,
        py: 1.75,
        transition: 'transform 0.15s ease, background-color 0.15s ease',
        '&:hover': { bgcolor: 'rgba(30,41,59,0.85)', transform: 'translateY(-2px)' },
        '&:active': { transform: 'scale(0.97)' },
      }}
    >
      {icon}
      <Typography variant="caption" fontWeight={600}>
        {label}
      </Typography>
    </Stack>
  );
}

function GlassSection({ children }: { children: React.ReactNode }) {
  return (
    <Stack
      spacing={1.5}
      sx={{
        position: 'relative',
        bgcolor: TOKENS.glassBg,
        backdropFilter: 'blur(20px) saturate(180%)',
        border: TOKENS.glassBorder,
        boxShadow: TOKENS.glassShadow,
        borderRadius: 4,
        p: 2.5,
      }}
    >
      {children}
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
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        bgcolor: TOKENS.pageBackground,
        color: TOKENS.onSurface,
      }}
    >
      <AmbientBackdrop />

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: TOKENS.headerBg,
          backdropFilter: 'blur(24px)',
          borderBottom: TOKENS.glassBorder,
          boxShadow: `0 24px 48px -8px rgba(0,0,0,0.7), 0 0 20px ${TOKENS.primaryContainer}33`,
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

      <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 480, mx: 'auto', px: 2, py: 3 }}>
        <Stack spacing={3}>
          <Box
            sx={{
              position: 'relative',
              borderRadius: 4,
              bgcolor: TOKENS.glassBg,
              backdropFilter: 'blur(20px) saturate(180%)',
              border: TOKENS.glassBorder,
              boxShadow: TOKENS.glassShadow,
              p: 3,
              textAlign: 'center',
              overflow: 'hidden',
            }}
          >
            <HeroMesh />
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
                    boxShadow: `0 0 0 4px rgba(192,193,255,0.15), 0 8px 24px -6px rgba(0,0,0,0.5)`,
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
                      border: `3px solid ${TOKENS.pageBackground}`,
                      boxShadow: `0 0 12px ${TOKENS.primary}88`,
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
              position: 'relative',
              overflow: 'hidden',
              py: 1.75,
              borderRadius: 999,
              textTransform: 'none',
              fontWeight: 700,
              fontSize: 16,
              background: `linear-gradient(135deg, ${TOKENS.primaryContainer}, #4F46E5)`,
              color: '#fff',
              boxShadow: `0 12px 28px -8px ${TOKENS.primaryContainer}88`,
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
                boxShadow: `0 0 24px ${TOKENS.primaryContainer}66, 0 12px 28px -8px ${TOKENS.primaryContainer}aa`,
              },
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
                minHeight: 68,
                borderRadius: 3,
                bgcolor: TOKENS.tileBg,
                border: TOKENS.tileBorder,
                boxShadow: TOKENS.tileShadow,
                backdropFilter: 'blur(12px)',
                color: TOKENS.onSurface,
                flexDirection: 'column',
                gap: 0.5,
                transition: 'transform 0.15s ease',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            />
          </Box>

          {card.bio ? (
            <GlassSection>
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
                        bgcolor: TOKENS.tileBg,
                        border: TOKENS.tileBorder,
                        color: TOKENS.onSurface,
                        fontWeight: 600,
                      }}
                    />
                  ))}
                </Stack>
              ) : null}
            </GlassSection>
          ) : null}

          {otherLinks.length > 0 ? (
            <GlassSection>
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
                        bgcolor: TOKENS.tileBg,
                        border: TOKENS.tileBorder,
                        borderRadius: 2,
                        p: 1.5,
                        transition: 'background-color 0.15s ease',
                        '&:hover': { bgcolor: 'rgba(30,41,59,0.85)' },
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
            </GlassSection>
          ) : null}
        </Stack>
      </Box>
    </Box>
  );
}
