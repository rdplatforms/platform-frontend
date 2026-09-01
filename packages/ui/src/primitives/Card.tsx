import type { ReactNode } from 'react';
import { Card as MuiCard, CardContent, CardMedia, Typography, Stack } from '@mui/material';

export interface CardProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageAlt?: string;
  footer?: ReactNode;
}

export function Card({ title, description, imageUrl, imageAlt, footer }: CardProps) {
  return (
    <MuiCard elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {imageUrl ? (
        <CardMedia
          component="img"
          height="180"
          image={imageUrl}
          alt={imageAlt ?? title}
          loading="lazy"
        />
      ) : null}
      <CardContent sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <Typography variant="h6" component="h3">
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary">
              {description}
            </Typography>
          ) : null}
          {footer}
        </Stack>
      </CardContent>
    </MuiCard>
  );
}
