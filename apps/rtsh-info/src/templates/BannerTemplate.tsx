import { Box, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AvatarBadge, ContactLines, LinkButtonList } from './shared';
import type { CardTemplateProps } from './types';

/** A colored banner strip up top with the avatar overlapping its bottom edge, plain surface below for the rest — inverts where the style's color actually lands compared to StackTemplate. */
export function BannerTemplate({ card, style }: CardTemplateProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.paper', display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 420 }}>
        <Box sx={{ height: 140, background: style.background }} />
        <Stack spacing={3} sx={{ px: 3, pb: 4 }} alignItems="center">
          <Box sx={{ mt: '-64px' }}>
            <AvatarBadge card={card} style={style} size={128} />
          </Box>

          <Stack spacing={0.5} alignItems="center" textAlign="center">
            <Typography variant="h5" fontWeight={700}>
              {card.name}
            </Typography>
            {card.title ? (
              <Typography variant="body1" color="text.secondary">
                {card.title}
              </Typography>
            ) : null}
            {card.location ? (
              <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">{card.location}</Typography>
              </Stack>
            ) : null}
          </Stack>

          <ContactLines card={card} style={{ ...style, secondaryTextColor: 'rgba(0,0,0,0.6)' }} />
          <LinkButtonList links={card.links} style={style} />
        </Stack>
      </Box>
    </Box>
  );
}
