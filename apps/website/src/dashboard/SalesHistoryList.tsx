import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton, Paper, Stack, Typography } from '@mui/material';
import type { SaleEntry } from '@rdplatforms/types';
import { formatCurrency, getSaleTotal } from '@rdplatforms/utils';
import { Badge } from '@rdplatforms/ui';

export interface SalesHistoryListProps {
  sales: SaleEntry[];
  onDelete: (id: string) => void;
}

export function SalesHistoryList({ sales, onDelete }: SalesHistoryListProps) {
  if (sales.length === 0) {
    return (
      <Typography color="text.secondary">
        No sales logged yet — add your first one above.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {sales.map((sale) => (
        <Paper key={sale.id} variant="outlined" sx={{ p: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1, sm: 2 }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
          >
            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <Badge
                  label={sale.kind === 'service' ? 'Service' : 'Product'}
                  color={sale.kind === 'service' ? 'primary' : 'secondary'}
                />
                <Typography fontWeight={600}>{sale.label}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {sale.occurredAt}
                {sale.customerName ? ` · ${sale.customerName}` : ''}
                {sale.note ? ` · ${sale.note}` : ''}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography fontWeight={700} whiteSpace="nowrap">
                {sale.quantity} × {formatCurrency(sale.unitPrice, sale.currency)} ={' '}
                {formatCurrency(getSaleTotal(sale), sale.currency)}
              </Typography>
              <IconButton
                aria-label={`Delete ${sale.label}`}
                size="small"
                onClick={() => onDelete(sale.id)}
              >
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
