import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useBusinessContext } from '@rdplatforms/contexts';
import { useLocale, useServices, useSettings } from '@rdplatforms/hooks';
import type { NewSaleItem, PaymentMethod, Sale } from '@rdplatforms/types';
import { formatCurrency, resolveLocalizedText } from '@rdplatforms/utils';
import type { Booking } from '@rdplatforms/types';
import { createSale, listSales, SalesAccessDeniedError } from '../api/salesApi';
import { listBookings } from '../api/bookingsApi';
import { useAuth } from '../auth/authContext';

const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'CARD', 'UPI', 'OTHER'];

function lineTotal(item: NewSaleItem): number {
  return item.quantity * item.unitPrice - item.discount;
}

export function BillingPage() {
  const { business } = useBusinessContext();
  const { token } = useAuth();
  const { locale } = useLocale();
  const { data: services } = useServices(business?.id ?? '');
  const { data: settings } = useSettings(business?.id ?? '');

  const [items, setItems] = useState<NewSaleItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [itemLabel, setItemLabel] = useState('');
  const [itemCategory, setItemCategory] = useState('');
  const [itemQuantity, setItemQuantity] = useState('1');
  const [itemUnitPrice, setItemUnitPrice] = useState('');
  const [itemDiscount, setItemDiscount] = useState('0');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [customerName, setCustomerName] = useState('');
  const [bookingId, setBookingId] = useState('');
  const [openBookings, setOpenBookings] = useState<Booking[]>([]);

  const [recentSales, setRecentSales] = useState<Sale[]>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  useEffect(() => {
    if (!token || !business) return;
    listBookings(token, business.id)
      .then((bookings) => setOpenBookings(bookings.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED')))
      .catch(() => setOpenBookings([]));
    listSales(token, business.id)
      .then((sales) => setRecentSales(sales.slice(0, 10)))
      .catch((err) => {
        // A Staff member without canViewFullAnalytics can still bill —
        // they just don't see history. Not an error worth alerting on.
        if (!(err instanceof SalesAccessDeniedError)) {
          setRecentSales(undefined);
        }
      });
  }, [token, business]);

  const onSelectService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    const service = services?.find((s) => s.id === serviceId);
    if (service) {
      setItemLabel(resolveLocalizedText(service.name, locale));
      setItemCategory(service.category ?? '');
      setItemUnitPrice(service.price !== undefined ? String(service.price) : '');
    }
  };

  const onAddItem = () => {
    const quantity = Number(itemQuantity);
    const unitPrice = Number(itemUnitPrice);
    const discount = Number(itemDiscount || '0');
    if (!itemLabel.trim() || !Number.isFinite(quantity) || quantity <= 0 || !Number.isFinite(unitPrice) || unitPrice < 0) {
      return;
    }
    setItems((prev) => [
      ...prev,
      { label: itemLabel.trim(), category: itemCategory.trim() || undefined, quantity, unitPrice, discount },
    ]);
    setSelectedServiceId('');
    setItemLabel('');
    setItemCategory('');
    setItemQuantity('1');
    setItemUnitPrice('');
    setItemDiscount('0');
  };

  const onRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const total = useMemo(() => items.reduce((sum, item) => sum + lineTotal(item), 0), [items]);
  const currency = settings?.currency ?? 'USD';

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !business || items.length === 0) return;
    setSubmitting(true);
    setError(undefined);
    setSuccess(undefined);
    try {
      const sale = await createSale(token, business.id, {
        paymentMethod,
        customerName: customerName.trim() || undefined,
        bookingId: bookingId || undefined,
        items,
      });
      setItems([]);
      setCustomerName('');
      setBookingId('');
      setSuccess(`Bill created — ${formatCurrency(sale.totalAmount, currency)}.`);
      setRecentSales((prev) => (prev ? [sale, ...prev].slice(0, 10) : prev));
      setOpenBookings((prev) => prev.filter((b) => b.id !== bookingId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create bill.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Billing
      </Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}

      <Paper variant="outlined" sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6" fontWeight={700}>
            Add an item
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="From catalog (optional)"
                value={selectedServiceId}
                onChange={(e) => onSelectService(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="">Custom item</MenuItem>
                {(services ?? []).map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {resolveLocalizedText(service.name, locale)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Label"
                value={itemLabel}
                onChange={(e) => setItemLabel(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Category"
                value={itemCategory}
                onChange={(e) => setItemCategory(e.target.value)}
                fullWidth
                size="small"
              />
            </Grid>
            <Grid item xs={6} sm={1}>
              <TextField
                label="Qty"
                type="number"
                value={itemQuantity}
                onChange={(e) => setItemQuantity(e.target.value)}
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 1 } }}
              />
            </Grid>
            <Grid item xs={6} sm={1}>
              <TextField
                label="Price"
                type="number"
                value={itemUnitPrice}
                onChange={(e) => setItemUnitPrice(e.target.value)}
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={6} sm={1}>
              <TextField
                label="Discount"
                type="number"
                value={itemDiscount}
                onChange={(e) => setItemDiscount(e.target.value)}
                fullWidth
                size="small"
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Grid>
          </Grid>
          <Box>
            <Button variant="outlined" onClick={onAddItem}>
              Add item
            </Button>
          </Box>

          {items.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Discount</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.label}</TableCell>
                    <TableCell>{item.category ?? '—'}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{formatCurrency(item.unitPrice, currency)}</TableCell>
                    <TableCell align="right">{formatCurrency(item.discount, currency)}</TableCell>
                    <TableCell align="right">{formatCurrency(lineTotal(item), currency)}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" aria-label="Remove item" onClick={() => onRemoveItem(index)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography color="text.secondary">No items added yet.</Typography>
          )}
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 480 }}>
        <Stack spacing={2} component="form" onSubmit={onSubmit}>
          <Typography variant="h6" fontWeight={700}>
            Finish bill
          </Typography>
          <TextField
            select
            label="Payment method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
            fullWidth
          >
            {PAYMENT_METHODS.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Customer name (optional)"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            fullWidth
          />
          {openBookings.length > 0 ? (
            <TextField
              select
              label="Fulfill a booking (optional)"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {openBookings.map((booking) => (
                <MenuItem key={booking.id} value={booking.id}>
                  {booking.customerName} — {booking.preferredDate} {booking.preferredTime}
                </MenuItem>
              ))}
            </TextField>
          ) : null}
          <Typography variant="h6" fontWeight={700}>
            Total: {formatCurrency(total, currency)}
          </Typography>
          <Box>
            <Button type="submit" variant="contained" disabled={submitting || items.length === 0}>
              Create bill
            </Button>
          </Box>
        </Stack>
      </Paper>

      {recentSales && recentSales.length > 0 ? (
        <Paper variant="outlined">
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" fontWeight={700}>
              Recent bills
            </Typography>
          </Box>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell align="right">Total</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recentSales.map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell>{new Date(sale.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{sale.customerName ?? '—'}</TableCell>
                  <TableCell>{sale.paymentMethod}</TableCell>
                  <TableCell align="right">{formatCurrency(sale.totalAmount, currency)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : null}
    </Stack>
  );
}
