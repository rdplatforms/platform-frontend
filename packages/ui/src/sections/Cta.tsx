import { Box, Stack, Typography } from '@mui/material';
import { toWhatsAppLink } from '@rdplatforms/utils';
import { Button } from '../primitives/Button';
import { Container } from '../primitives/Container';
import type { SectionProps } from './types';

export function Cta({ business, config }: SectionProps) {
  return (
    <Box
      component="section"
      sx={{
        bgcolor: 'primary.main',
        color: 'primary.contrastText',
        py: { xs: 6, md: 8 },
      }}
    >
      <Container>
        <Stack spacing={2} alignItems="center" textAlign="center">
          <Typography variant="h4" fontWeight={700}>
            {config.title ?? 'Ready To Get Started?'}
          </Typography>
          {config.subtitle ? <Typography variant="body1">{config.subtitle}</Typography> : null}
          <Stack direction="row" spacing={2}>
            <Button
              href={`tel:${business.contact.phone}`}
              color="inherit"
              variant="contained"
              sx={{ color: 'primary.main', bgcolor: 'common.white' }}
            >
              Call Us
            </Button>
            {business.contact.whatsapp ? (
              <Button
                href={toWhatsAppLink(business.contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                variant="outlined"
                color="inherit"
              >
                WhatsApp Us
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
