import { Avatar, Box, Button, Stack, Typography } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { formatPhoneForDisplay, getAvatarColors, getInitials } from '@rdplatforms/utils';
import { resolveCardStyle } from '../cardStyles';
import { useCard } from '../hooks/useCard';
import { hrefForLink, iconForLink, labelForLink } from '../linkPresentation';

export function CardPage() {
  const { card } = useCard();

  if (!card) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700}>
          Card not found
        </Typography>
        <Typography color="text.secondary">This link doesn't match a card yet.</Typography>
      </Box>
    );
  }

  const style = resolveCardStyle(card.style);
  const avatarColors = getAvatarColors(card.name);

  return (
    <Box sx={{ minHeight: '100vh', background: style.background, display: 'flex', justifyContent: 'center', p: 3 }}>
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 420, pt: 4 }} alignItems="center">
        <Avatar
          src={card.photoUrl || undefined}
          alt={card.name}
          sx={{
            width: 128,
            height: 128,
            fontSize: 40,
            fontWeight: 700,
            bgcolor: avatarColors.bg,
            color: avatarColors.fg,
            border: `3px solid ${style.avatarRing}`,
          }}
        >
          {getInitials(card.name)}
        </Avatar>

        <Stack spacing={0.5} alignItems="center" textAlign="center">
          <Typography variant="h5" fontWeight={700} sx={{ color: style.textColor }}>
            {card.name}
          </Typography>
          {card.title ? (
            <Typography variant="body1" sx={{ color: style.secondaryTextColor }}>
              {card.title}
            </Typography>
          ) : null}
          {card.location ? (
            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ color: style.secondaryTextColor }}>
              <LocationOnIcon fontSize="small" />
              <Typography variant="body2">{card.location}</Typography>
            </Stack>
          ) : null}
        </Stack>

        <Stack spacing={1} alignItems="center" sx={{ width: '100%' }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ color: style.secondaryTextColor }}>
            <PhoneIcon fontSize="small" />
            <Typography variant="body2">{formatPhoneForDisplay(card.phone)}</Typography>
          </Stack>
          {card.email ? (
            <Stack direction="row" spacing={1} alignItems="center" sx={{ color: style.secondaryTextColor }}>
              <EmailIcon fontSize="small" />
              <Typography variant="body2">{card.email}</Typography>
            </Stack>
          ) : null}
        </Stack>

        <Stack spacing={1.5} sx={{ width: '100%' }}>
          {card.links.map((link, index) => {
            const Icon = iconForLink(link);
            return (
              <Button
                key={`${link.type}-${index}`}
                component="a"
                href={hrefForLink(link)}
                target={link.type === 'call' ? undefined : '_blank'}
                rel="noopener noreferrer"
                size="large"
                startIcon={<Icon />}
                fullWidth
                sx={style.buttonSx}
              >
                {labelForLink(link)}
              </Button>
            );
          })}
        </Stack>
      </Stack>
    </Box>
  );
}
