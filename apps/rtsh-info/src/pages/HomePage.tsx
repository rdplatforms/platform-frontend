import { Box, Button, Divider, Stack, Typography } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { toWhatsAppLink } from '@rdplatforms/utils';
import { CARD_TEMPLATES } from '../templates';
import { SAMPLE_CARD } from '../sampleCard';
import { CardLookupForm } from '../components/CardLookupForm';

/**
 * Who a "Request this style" message goes to — there's no self-serve
 * signup (Milestone 9's whole scope: dev-managed, no accounts), so this
 * is the entire "onboarding" flow: a visitor picks a template they like,
 * WhatsApps the request, and the card gets added by hand from there,
 * same as every card today.
 */
const REQUEST_WHATSAPP_NUMBER = '+919322527567';

const PREVIEW_SOURCE_WIDTH = 375;
const PREVIEW_SOURCE_HEIGHT = 760;
const PREVIEW_SCALE = 0.34;

function buildRequestMessage(templateLabel: string): string {
  return `Hi, I'd like a Card Viewer card in the "${templateLabel}" style.`;
}

/** The showcase/landing page at "/" — browse every template with a live preview (the actual component, rendered small, not a screenshot) and request one via WhatsApp. The phone-number lookup that used to be the only thing on "/" (NotFoundPage) still lives here too. */
export function HomePage() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f7f7fa', py: { xs: 4, sm: 6 } }}>
      <Box sx={{ maxWidth: 1000, mx: 'auto', px: 2 }}>
        <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 5 }}>
          <Typography
            variant="overline"
            sx={{ color: 'primary.main', letterSpacing: '0.1em', fontWeight: 700 }}
          >
            Card Viewer
          </Typography>
          <Typography variant="h4" fontWeight={800}>
            Pick a style for your digital card
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 520 }}>
            Every card below is real, live code — not a mockup. Tap "Request this style" to get one
            made for you.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          {Object.entries(CARD_TEMPLATES).map(([key, entry]) => {
            const Template = entry.component;
            return (
              <Stack
                key={key}
                spacing={1.5}
                alignItems="center"
                sx={{
                  bgcolor: '#fff',
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 3,
                  p: 2.5,
                }}
              >
                <Box
                  sx={{
                    width: PREVIEW_SOURCE_WIDTH * PREVIEW_SCALE,
                    height: PREVIEW_SOURCE_HEIGHT * PREVIEW_SCALE,
                    overflow: 'hidden',
                    borderRadius: 2,
                    border: '1px solid rgba(0,0,0,0.1)',
                    position: 'relative',
                  }}
                >
                  <Box
                    sx={{
                      width: PREVIEW_SOURCE_WIDTH,
                      height: PREVIEW_SOURCE_HEIGHT,
                      transform: `scale(${PREVIEW_SCALE})`,
                      transformOrigin: 'top left',
                      pointerEvents: 'none',
                    }}
                  >
                    <Template card={SAMPLE_CARD} />
                  </Box>
                </Box>

                <Stack spacing={0.5} alignItems="center" textAlign="center">
                  <Typography variant="subtitle1" fontWeight={700}>
                    {entry.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {entry.description}
                  </Typography>
                </Stack>

                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<WhatsAppIcon />}
                  component="a"
                  href={toWhatsAppLink(REQUEST_WHATSAPP_NUMBER, buildRequestMessage(entry.label))}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Request this style
                </Button>
              </Stack>
            );
          })}
        </Box>

        <Divider sx={{ my: 5 }} />

        <Stack
          spacing={2}
          alignItems="center"
          textAlign="center"
          sx={{ maxWidth: 360, mx: 'auto' }}
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Already have a card?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Enter the mobile number it's linked to.
          </Typography>
          <CardLookupForm />
        </Stack>
      </Box>
    </Box>
  );
}
