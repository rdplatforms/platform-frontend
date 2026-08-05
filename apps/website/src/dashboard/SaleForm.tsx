import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Grid, MenuItem, Stack, TextField, Typography } from '@mui/material';
import type { NewSaleEntry } from '@rdplatforms/types';
import { Button } from '@rdplatforms/ui';

const saleFormSchema = z.object({
  kind: z.enum(['service', 'product']),
  label: z.string().min(2, 'Enter a name'),
  quantity: z.coerce.number().min(1, 'At least 1'),
  unitPrice: z.coerce.number().min(0, 'Must be 0 or more'),
  customerName: z.string().optional(),
  note: z.string().optional(),
  occurredAt: z.string().min(1, 'Pick a date'),
});

type SaleFormValues = z.infer<typeof saleFormSchema>;

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export interface SaleFormProps {
  businessId: string;
  currency: string;
  onSubmitSale: (entry: NewSaleEntry) => void;
  isSubmitting: boolean;
}

export function SaleForm({ businessId, currency, onSubmitSale, isSubmitting }: SaleFormProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleFormSchema),
    defaultValues: {
      kind: 'service',
      label: '',
      quantity: 1,
      unitPrice: 0,
      customerName: '',
      note: '',
      occurredAt: today(),
    },
  });

  const onSubmit = handleSubmit((values) => {
    onSubmitSale({
      businessId,
      currency,
      kind: values.kind,
      label: values.label,
      quantity: values.quantity,
      unitPrice: values.unitPrice,
      customerName: values.customerName || undefined,
      note: values.note || undefined,
      occurredAt: values.occurredAt,
    });
    reset({ ...values, label: '', quantity: 1, unitPrice: 0, customerName: '', note: '' });
  });

  return (
    <Stack component="form" spacing={2} onSubmit={onSubmit}>
      <Typography variant="h6" fontWeight={700}>
        Log a Sale
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Controller
            name="kind"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Type" fullWidth>
                <MenuItem value="service">Service</MenuItem>
                <MenuItem value="product">Product</MenuItem>
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={8}>
          <Controller
            name="label"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Name"
                placeholder="Haircut, Shampoo, Tasting Menu..."
                error={!!errors.label}
                helperText={errors.label?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label="Qty"
                error={!!errors.quantity}
                helperText={errors.quantity?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <Controller
            name="unitPrice"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="number"
                label={`Unit Price (${currency})`}
                error={!!errors.unitPrice}
                helperText={errors.unitPrice?.message}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="occurredAt"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type="date"
                label="Date"
                error={!!errors.occurredAt}
                helperText={errors.occurredAt?.message}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Controller
            name="customerName"
            control={control}
            render={({ field }) => <TextField {...field} label="Customer (optional)" fullWidth />}
          />
        </Grid>
        <Grid item xs={12}>
          <Controller
            name="note"
            control={control}
            render={({ field }) => <TextField {...field} label="Note (optional)" fullWidth />}
          />
        </Grid>
      </Grid>
      <Button
        type="submit"
        disabled={isSubmitting}
        sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
      >
        Add Sale
      </Button>
    </Stack>
  );
}
