import { useEffect } from 'react';
import { useBusiness, useSettings } from '@rdplatforms/hooks';
import { loadGoogleAnalytics } from '@rdplatforms/utils';

/**
 * Per-business — each business's own GA4 property
 * (BusinessSettings.googleAnalyticsId), not one shared rdplatforms id.
 * A no-op business (undefined) or one with none set never loads the
 * script at all. See docs/analytics.md and
 * @rdplatforms/utils' loadGoogleAnalytics for the shared logic apps/portal
 * /admin/rtsh-info also use, with a fixed id instead of a per-business one.
 */
export function GoogleAnalytics() {
  const { business } = useBusiness();
  const { data: settings } = useSettings(business?.id);
  const measurementId = settings?.googleAnalyticsId;

  useEffect(() => {
    if (!measurementId) {
      return;
    }
    return loadGoogleAnalytics(measurementId);
  }, [measurementId]);

  return null;
}
