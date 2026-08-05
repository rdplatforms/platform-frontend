import type { ReactNode } from 'react';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { useBusiness } from '@rdplatforms/hooks';

export interface BusinessGateProps {
  children: ReactNode;
}

/**
 * Renders a loading state while BusinessResolver is working, and a clear
 * error state if no business could be resolved at all — instead of
 * silently rendering a page with no business data.
 */
export function BusinessGate({ children }: BusinessGateProps) {
  const { business, isLoading, error } = useBusiness();

  if (isLoading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !business) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          p: 4,
        }}
      >
        <Stack spacing={1} alignItems="center" textAlign="center">
          <Typography variant="h5" fontWeight={700}>
            We couldn&apos;t find this business
          </Typography>
          <Typography color="text.secondary">
            Check the domain or, in local development, try adding <code>?business=royal-salon</code>{' '}
            to the URL.
          </Typography>
        </Stack>
      </Box>
    );
  }

  return <>{children}</>;
}
