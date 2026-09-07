import { Box, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AvatarBadge, ContactLines, LinkButtonList } from './shared';
import type { CardTemplateProps } from './types';

/** Full-bleed colored background, everything centered top-to-bottom, full-width pill buttons — the plainest, most "digital business card" layout. */
export function StackTemplate({ card, style }: CardTemplateProps) {
  return (
    <Box sx={{ minHeight: '100vh', background: style.background, display: 'flex', justifyContent: 'center', p: 3 }}>
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 420, pt: 4 }} alignItems="center">
        <AvatarBadge card={card} style={style} />

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

        <ContactLines card={card} style={style} />
        <LinkButtonList links={card.links} style={style} />
      </Stack>
    </Box>
  );
}
