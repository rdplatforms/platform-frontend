import { useState, type FormEvent } from 'react';
import {
  Box,
  Button,
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
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '@rdplatforms/contexts';
import {
  useBusiness,
  useCheckout,
  useLocale,
  useSettings,
  useWhatsAppSubmit,
} from '@rdplatforms/hooks';
import type { PaymentMethod } from '@rdplatforms/types';
import { buildCartOrderMessage, formatCurrency, translateUi } from '@rdplatforms/utils';

const PAYMENT_METHODS: PaymentMethod[] = ['CASH', 'CARD', 'UPI', 'OTHER'];

export function CartPage() {
  const { business } = useBusiness();
  const { locale } = useLocale();
  const { data: settings } = useSettings(business?.id);
  const cart = useCart();
  const checkout = useCheckout(business?.id ?? '');
  const whatsappNumber = business?.contact.whatsapp ?? business?.contact.phone ?? '';
  const { sent, send } = useWhatsAppSubmit(whatsappNumber);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currency = settings?.currency ?? cart.items[0]?.currency ?? 'USD';

  if (sent) {
    return (
      <Box sx={{ maxWidth: 480, mx: 'auto', p: 4, textAlign: 'center' }}>
        <Typography variant="h5" fontWeight={700} gutterBottom>
          {translateUi('orderPlacedTitle', locale)}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {translateUi('orderPlacedMessage', locale)}
        </Typography>
        <Button component={RouterLink} to="/" variant="contained" sx={{ mt: 2 }}>
          {translateUi('backToHome', locale)}
        </Button>
      </Box>
    );
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!business || cart.items.length === 0) return;
    setIsSubmitting(true);

    try {
      await checkout.mutateAsync({
        paymentMethod,
        customerName: name.trim() || undefined,
        customerEmail: email.trim() || undefined,
        customerPhone: phone.trim() || undefined,
        items: cart.items.map((item) => ({
          label: item.name,
          category: item.category,
          quantity: item.quantity,
          unitPrice: item.price,
          discount: 0,
        })),
      });
    } catch (err) {
      // Best-effort, same as Appointment/Contact: the WhatsApp handoff
      // below is still the customer's actual order reaching the
      // business, so it must proceed regardless of whether a backend is
      // configured for this business or the save failed. See docs/shop.md.
      console.error('Failed to save the order to the backend:', err);
    }

    const message = buildCartOrderMessage(
      {
        customerName: name.trim(),
        items: cart.items.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        subtotal: cart.subtotal,
        currency,
        paymentMethod,
      },
      locale,
    );

    send(message);
    cart.clear();
    setIsSubmitting(false);
  };

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto', p: { xs: 2, sm: 4 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        {translateUi('yourCart', locale)}
      </Typography>

      {cart.items.length === 0 ? (
        <Stack spacing={2} alignItems="flex-start">
          <Typography color="text.secondary">{translateUi('cartEmpty', locale)}</Typography>
          <Button component={RouterLink} to="/" variant="outlined">
            {translateUi('continueShopping', locale)}
          </Button>
        </Stack>
      ) : (
        <Stack spacing={3}>
          <Paper variant="outlined">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Item</TableCell>
                  <TableCell align="right">{translateUi('quantity', locale)}</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {cart.items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell align="right">
                      <TextField
                        type="number"
                        size="small"
                        value={item.quantity}
                        onChange={(e) => cart.setQuantity(item.productId, Number(e.target.value))}
                        slotProps={{
                          htmlInput: { min: 1, style: { width: 48, textAlign: 'right' } },
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(item.price * item.quantity, item.currency)}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        aria-label={translateUi('remove', locale)}
                        onClick={() => cart.removeItem(item.productId)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="h6" fontWeight={700}>
                {translateUi('subtotal', locale)}: {formatCurrency(cart.subtotal, currency)}
              </Typography>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3 }}>
            <Stack spacing={2} component="form" onSubmit={onSubmit}>
              <Typography variant="h6" fontWeight={700}>
                {translateUi('checkout', locale)}
              </Typography>
              <TextField
                label={translateUi('name', locale)}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label={translateUi('email', locale)}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
              />
              <TextField
                label={translateUi('phoneOptional', locale)}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
              />
              <TextField
                select
                label={translateUi('paymentMethod', locale)}
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
              <Box>
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
                  {translateUi('placeOrder', locale)}
                </Button>
              </Box>
            </Stack>
          </Paper>
        </Stack>
      )}
    </Box>
  );
}
