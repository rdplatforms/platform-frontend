import { Box, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AvatarBadge, ContactLines, LinkIconGrid } from './shared';
import type { CardTemplateProps } from './types';

/** Avatar and name sit side by side instead of stacked, and links render as a compact icon grid instead of full-width buttons — denser, less scrolling. */
export function CompactTemplate({ card, style }: CardTemplateProps) {
  return (
    <Box sx={{ minHeight: '100vh', background: style.background, display: 'flex', justifyContent: 'center', p: 3 }}>
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 420, pt: 4 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <AvatarBadge card={card} style={style} size={88} />
          <Stack spacing={0.25}>
            <Typography variant="h6" fontWeight={700} sx={{ color: style.textColor }}>
              {card.name}
            </Typography>
            {card.title ? (
              <Typography variant="body2" sx={{ color: style.secondaryTextColor }}>
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
        </Stack>

        <ContactLines card={card} style={style} align="flex-start" />
        <LinkIconGrid links={card.links} style={style} columns={3} />
      </Stack>
    </Box>
  );
}
