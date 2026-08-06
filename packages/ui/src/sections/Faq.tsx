import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFaqs, useLocale } from '@rdplatforms/hooks';
import { resolveLocalizedText, translateUi } from '@rdplatforms/utils';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Faq({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const { data: faqs, isLoading } = useFaqs(business.id);

  return (
    <PageSection id="faq">
      <SectionTitle
        title={resolveLocalizedText(config.title, locale) || translateUi('faqTitle', locale)}
        subtitle={resolveLocalizedText(config.subtitle, locale)}
      />

      {isLoading ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        (faqs ?? []).map((faq) => (
          <Accordion key={faq.id} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{resolveLocalizedText(faq.question, locale)}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">
                {resolveLocalizedText(faq.answer, locale)}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </PageSection>
  );
}
