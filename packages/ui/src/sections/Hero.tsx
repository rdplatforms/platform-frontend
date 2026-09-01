import { Box, Stack, Typography } from '@mui/material';
import { useLocale } from '@rdplatforms/hooks';
import { resolveLocalizedText, translateUi } from '@rdplatforms/utils';
import { Button } from '../primitives/Button';
import { Container } from '../primitives/Container';
import type { SectionProps } from './types';

export function Hero({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const title =
    resolveLocalizedText(config.title, locale) ||
    resolveLocalizedText(business.tagline, locale) ||
    business.displayName;
  const subtitle =
    resolveLocalizedText(config.subtitle, locale) ||
    resolveLocalizedText(business.description, locale);

  return (
    <Box
      component="section"
      sx={{
        background: (theme) =>
          `linear-gradient(180deg, ${theme.palette.primary.main}1a 0%, transparent 100%)`,
        py: { xs: 6, md: 10 },
      }}
    >
      <Container>
        <Stack spacing={3} alignItems="flex-start" maxWidth={720}>
          <Typography variant="h2" component="h1" fontWeight={800}>
            {title}
          </Typography>
          <Typography variant="h6" component="p" color="text.secondary" fontWeight={400}>
            {subtitle}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button href="#contact" size="large">
              {translateUi('getInTouch', locale)}
            </Button>
            <Button href="#services" variant="outlined" size="large">
              {translateUi('exploreServices', locale)}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
