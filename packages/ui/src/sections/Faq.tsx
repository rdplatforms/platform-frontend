import { Accordion, AccordionDetails, AccordionSummary, Skeleton, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useFaqs } from '@rdplatforms/hooks';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

export function Faq({ business, config }: SectionProps) {
  const { data: faqs, isLoading } = useFaqs(business.id);

  return (
    <PageSection id="faq">
      <SectionTitle
        title={config.title ?? 'Frequently Asked Questions'}
        subtitle={config.subtitle}
      />

      {isLoading ? (
        <Skeleton variant="rounded" height={200} />
      ) : (
        (faqs ?? []).map((faq) => (
          <Accordion key={faq.id} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight={600}>{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </PageSection>
  );
}
