import { Button, Paper, Stack, Typography } from '@mui/material';
import { CARD_STYLES } from '../cardStyles';
import { CARD_TEMPLATES } from '../templates';

/**
 * Dev-only (see the `import.meta.env.DEV` check where this is rendered,
 * CardPage.tsx) — cycles the live preview through every style/template
 * combination without editing JSON, so building/reviewing all of them
 * doesn't mean hand-editing a Card record over and over. Never renders
 * in a production build, so it never reaches a real visitor's scanned
 * card.
 */
export function DevPreviewSwitcher({
  styleKey,
  templateKey,
  onCycleStyle,
  onCycleTemplate,
}: {
  styleKey: string;
  templateKey: string;
  onCycleStyle: () => void;
  onCycleTemplate: () => void;
}) {
  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1300,
        p: 1.5,
        borderRadius: 3,
        bgcolor: 'rgba(20,20,30,0.85)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <Stack spacing={1}>
        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 600 }}>
          DEV PREVIEW
        </Typography>
        <Button size="small" variant="contained" onClick={onCycleTemplate} sx={{ textTransform: 'none' }}>
          Template: {CARD_TEMPLATES[templateKey]?.label ?? templateKey}
        </Button>
        <Button size="small" variant="contained" onClick={onCycleStyle} sx={{ textTransform: 'none' }}>
          Style: {CARD_STYLES[styleKey]?.label ?? styleKey}
        </Button>
      </Stack>
    </Paper>
  );
}
