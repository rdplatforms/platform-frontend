import { Box, Divider, Link, Stack, Typography } from '@mui/material';
import type { Business } from '@rdplatforms/types';
import { formatDayLabel, formatHoursRange, formatPhoneForDisplay } from '@rdplatforms/utils';
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
  const currentYear = new Date().getFullYear();
  const socialEntries = Object.entries(business.social).filter(([, url]) => Boolean(url));

  return (
    <Box component="footer" sx={{ bgcolor: 'action.hover', pt: 6, pb: 4, mt: 8 }}>
      <Container>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="space-between">
          <Stack spacing={1} sx={{ maxWidth: 320 }}>
            <Typography variant="h6" fontWeight={700}>
              {business.displayName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {business.description}
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              Contact
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatPhoneForDisplay(business.contact.phone)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {business.contact.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {business.contact.address.line1}, {business.contact.address.city},{' '}
              {business.contact.address.state} {business.contact.address.postalCode}
            </Typography>
          </Stack>

          <Stack spacing={1}>
            <Typography variant="subtitle2" fontWeight={700}>
              Hours
            </Typography>
            {business.hours.map((entry) => (
              <Typography key={entry.day} variant="body2" color="text.secondary">
                {formatDayLabel(entry.day)}: {formatHoursRange(entry.opensAt, entry.closesAt)}
              </Typography>
            ))}
          </Stack>

          {socialEntries.length > 0 ? (
            <Stack spacing={1}>
              <Typography variant="subtitle2" fontWeight={700}>
                Follow
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
          &copy; {currentYear} {business.legalName}. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
