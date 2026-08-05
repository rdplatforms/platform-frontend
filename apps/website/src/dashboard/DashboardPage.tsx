import {
  AppBar,
  Box,
  CircularProgress,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  useBusiness,
  useCreateSale,
  useDeleteSale,
  useSales,
  useSettings,
} from '@rdplatforms/hooks';
import { Button } from '@rdplatforms/ui';
import { DashboardGate } from './DashboardGate';
import { SaleForm } from './SaleForm';
import { SalesHistoryList } from './SalesHistoryList';
import { SummaryCards } from './SummaryCards';
import { clearDashboardAuthed } from './dashboardAuth';

function DashboardContent({
  businessId,
  businessName,
}: {
  businessId: string;
  businessName: string;
}) {
  const { data: settings } = useSettings(businessId);
  const { data: sales, isLoading } = useSales(businessId);
  const createSale = useCreateSale(businessId);
  const deleteSale = useDeleteSale(businessId);
  const currency = settings?.currency ?? 'USD';

  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={700}>
            {businessName} Dashboard
          </Typography>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              clearDashboardAuthed(businessId);
              window.location.reload();
            }}
          >
            Log Out
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Stack spacing={4}>
          {isLoading || !sales ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <SummaryCards sales={sales} currency={currency} />
              <Divider />
              <SaleForm
                businessId={businessId}
                currency={currency}
                isSubmitting={createSale.isPending}
                onSubmitSale={(entry) => createSale.mutate(entry)}
              />
              <Divider />
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  Sales History
                </Typography>
                <SalesHistoryList sales={sales} onDelete={(id) => deleteSale.mutate(id)} />
              </Stack>
            </>
          )}
        </Stack>
      </Container>
    </>
  );
}

export function DashboardPage() {
  const { business } = useBusiness();

  if (!business) {
    return null;
  }

  return (
    <DashboardGate business={business}>
      <DashboardContent businessId={business.id} businessName={business.displayName} />
    </DashboardGate>
  );
}
