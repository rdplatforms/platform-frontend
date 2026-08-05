import { Box, Stack, Typography } from '@mui/material';
import { Button } from '../primitives/Button';
import { Container } from '../primitives/Container';
import type { SectionProps } from './types';

export function Hero({ business, config }: SectionProps) {
  return (
    <Box
      component="section"
      sx={{
        background: (theme) =>
          `linear-gradient(180deg, ${theme.palette.primary.main}1a 0%, transparent 100%)`,
        py: { xs: 8, md: 14 },
      }}
    >
      <Container>
        <Stack spacing={3} alignItems="flex-start" maxWidth={720}>
          <Typography variant="h2" component="h1" fontWeight={800}>
            {config.title ?? business.tagline ?? business.displayName}
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" fontWeight={400}>
            {config.subtitle ?? business.description}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button href="#contact" size="large">
              Get In Touch
            </Button>
            <Button href="#services" variant="outlined" size="large">
              Explore Services
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
