import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DevPreviewSwitcher } from '../components/DevPreviewSwitcher';
import { CARD_STYLES, resolveCardStyle } from '../cardStyles';
import { CARD_TEMPLATES, resolveCardTemplate } from '../templates';
import { useCard } from '../hooks/useCard';
import { cycleNext } from '../utils/cycle';

const STYLE_KEYS = Object.keys(CARD_STYLES);
const TEMPLATE_KEYS = Object.keys(CARD_TEMPLATES);

export function CardPage() {
  const { card } = useCard();
  const [styleOverride, setStyleOverride] = useState<string>();
  const [templateOverride, setTemplateOverride] = useState<string>();

  if (!card) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 3, textAlign: 'center' }}>
        <Typography variant="h6" fontWeight={700}>
          Card not found
        </Typography>
        <Typography color="text.secondary">This link doesn't match a card yet.</Typography>
      </Box>
    );
  }

  const styleKey = styleOverride ?? card.style ?? 'style1';
  const templateKey = templateOverride ?? card.template ?? 'template1';
  const style = resolveCardStyle(styleKey);
  const Template = resolveCardTemplate(templateKey).component;

  return (
    <>
      <Template card={card} style={style} />
      {import.meta.env.DEV ? (
        <DevPreviewSwitcher
          styleKey={styleKey}
          templateKey={templateKey}
          onCycleStyle={() => setStyleOverride(cycleNext(STYLE_KEYS, styleKey))}
          onCycleTemplate={() => setTemplateOverride(cycleNext(TEMPLATE_KEYS, templateKey))}
        />
      ) : null}
    </>
  );
}
