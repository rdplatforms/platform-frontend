import { Box, Paper, Stack, Typography } from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { AvatarBadge, ContactLines, LinkIconGrid } from './shared';
import type { CardTemplateProps } from './types';

/** A rounded, shadowed rectangle on a neutral backdrop, mimicking an actual physical card lying on a table, rather than a full-bleed page — most literally "card-shaped" of the templates. */
export function FramedTemplate({ card, style }: CardTemplateProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#e9ebef', display: 'grid', placeItems: 'center', p: 3 }}>
      <Paper
        elevation={0}
        sx={{
          width: '100%',
          maxWidth: 380,
          borderRadius: 5,
          background: style.background,
          p: 3.5,
          boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
        }}
      >
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          <AvatarBadge card={card} style={style} size={80} />

          <Stack spacing={0.25} alignItems="center">
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
                <Typography variant="caption">{card.location}</Typography>
              </Stack>
            ) : null}
          </Stack>

          <ContactLines card={card} style={style} />
          <LinkIconGrid links={card.links} style={style} columns={3} />
        </Stack>
      </Paper>
    </Box>
  );
}
