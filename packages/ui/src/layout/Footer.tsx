import { Box, Divider, Link, Stack, Typography } from '@mui/material';
import type { Business } from '@rdplatforms/types';
import { useLocale } from '@rdplatforms/hooks';
import {
  formatAddressLine,
  formatDayLabel,
  formatHoursRange,
  formatPhoneForDisplay,
  resolveLocalizedText,
  translateUi,
} from '@rdplatforms/utils';
import { Container } from '../primitives/Container';

export interface FooterProps {
  business: Business;
}

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  pinterest: 'Pinterest',
};

export function Footer({ business }: FooterProps) {
  const { locale } = useLocale();
  const currentYear = new Date().getFullYear();
  const socialEntries = Object.entries(business.social).filter(([, url]) => Boolean(url));
  const addressLine = formatAddressLine(business.contact.address);

  return (
    <Box component="footer" sx={{ bgcolor: 'action.hover', pt: 6, pb: 4, mt: 8 }}>
      <Container>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between">
          <Stack spacing={1} sx={{ maxWidth: 320 }}>
            <Typography variant="h6" fontWeight={700}>
              {business.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {resolveLocalizedText(business.description, locale)}
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              {translateUi('contactLabel', locale)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatPhoneForDisplay(business.contact.phone)}
            </Typography>
            {business.contact.email ? (
              <Typography variant="body2" color="text.secondary">
                {business.contact.email}
              </Typography>
            ) : null}
            {addressLine ? (
              <Typography variant="body2" color="text.secondary">
                {addressLine}
              </Typography>
            ) : null}
          </Stack>

          {business.hours.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={700}>
                {translateUi('hoursLabel', locale)}
              </Typography>
              {business.hours.map((entry) => (
                <Typography key={entry.day} variant="body2" color="text.secondary">
                  {formatDayLabel(entry.day, locale)}:{' '}
                  {formatHoursRange(entry.opensAt, entry.closesAt, locale)}
                </Typography>
              ))}
            </Stack>
          ) : null}

          {socialEntries.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={700}>
                {translateUi('followLabel', locale)}
              </Typography>
              {socialEntries.map(([platform, url]) => (
                <Link
                  key={platform}
                  href={url}
                  underline="hover"
                  color="text.secondary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {SOCIAL_LABELS[platform] ?? platform}
                </Link>
              ))}
            </Stack>
          ) : null}
        </Stack>

        <Divider sx={{ my: 4 }} />

        <Typography variant="caption" color="text.secondary">
          &copy; {currentYear} {business.legalName}. {translateUi('allRightsReserved', locale)}
        </Typography>
      </Container>
    </Box>
  );
}
