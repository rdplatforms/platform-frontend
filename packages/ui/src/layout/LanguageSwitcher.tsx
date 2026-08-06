import { Stack, Typography } from '@mui/material';
import type { SupportedLocale } from '@rdplatforms/types';
import { useLocale } from '@rdplatforms/hooks';

const LOCALE_LABELS: Record<SupportedLocale, string> = {
  en: 'English',
  mr: 'मराठी',
};

/**
 * Renders nothing for a single-language business — availableLocales only
 * ever has one entry unless the business opted into bilingual content via
 * Business.supportedLocales.
 */
export function LanguageSwitcher() {
  const { locale, availableLocales, setLocale } = useLocale();

  if (availableLocales.length < 2) {
    return null;
  }

  return (
    <Stack direction="row" spacing={0.5} alignItems="center" aria-label="Language">
      {availableLocales.map((available, index) => (
        <Stack key={available} direction="row" alignItems="center" spacing={0.5}>
          {index > 0 ? (
            <Typography color="text.disabled" variant="body2">
              |
            </Typography>
          ) : null}
          <Typography
            component="button"
            onClick={() => setLocale(available)}
            variant="body2"
            fontWeight={available === locale ? 700 : 400}
            sx={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              p: 0,
              color: available === locale ? 'primary.main' : 'text.secondary',
            }}
          >
            {LOCALE_LABELS[available]}
          </Typography>
        </Stack>
      ))}
    </Stack>
  );
}
