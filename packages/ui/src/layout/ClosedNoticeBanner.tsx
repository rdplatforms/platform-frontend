import { useState } from 'react';
import { Dialog, DialogContent, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import type { Business } from '@rdplatforms/types';
import { useLocale } from '@rdplatforms/hooks';
import { isBusinessOpenNow, translateUi } from '@rdplatforms/utils';

export interface ClosedNoticeBannerProps {
  business: Business;
}

/**
 * A dismissible modal shown once per page load when the business is
 * currently closed, computed from its own BusinessHours data (see
 * docs/business-hours.md) — never hardcoded hours. Renders nothing for a
 * business with no hours configured, since absence of data isn't the same
 * as "closed" (see isBusinessOpenNow).
 */
export function ClosedNoticeBanner({ business }: ClosedNoticeBannerProps) {
  const { locale } = useLocale();
  const [dismissed, setDismissed] = useState(false);

  if (business.hours.length === 0 || dismissed || isBusinessOpenNow(business.hours)) {
    return null;
  }

  return (
    <Dialog open onClose={() => setDismissed(true)} maxWidth="xs" fullWidth>
      <DialogContent sx={{ position: 'relative', textAlign: 'center', py: 5 }}>
        <IconButton
          aria-label="Close"
          onClick={() => setDismissed(true)}
          sx={{ position: 'absolute', top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {translateUi('closedBannerTitle', locale)}
        </Typography>
        <Typography color="text.secondary">{translateUi('closedBannerMessage', locale)}</Typography>
      </DialogContent>
    </Dialog>
  );
}
