import type { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Container } from './Container';

export interface PageSectionProps {
  children: ReactNode;
  id?: string;
  tone?: 'default' | 'subtle';
}

/**
 * Vertical rhythm + horizontal containment for every section on the page.
 * Sections never manage their own top-level spacing or max-width — this is
 * what keeps a Hero and a Testimonials block visually consistent even
 * though they were built independently.
 */
export function PageSection({ children, id, tone = 'default' }: PageSectionProps) {
  return (
    <Box
      component="section"
      id={id}
      sx={{
        py: { xs: 6, md: 10 },
        bgcolor: tone === 'subtle' ? 'action.hover' : 'transparent',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Container>{children}</Container>
    </Box>
  );
}
