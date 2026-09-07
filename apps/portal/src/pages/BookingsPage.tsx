import { useEffect, useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useBusinessContext } from '@rdplatforms/contexts';
import { useLocale, useServices } from '@rdplatforms/hooks';
import type { Booking, BookingStatus } from '@rdplatforms/types';
import { resolveLocalizedText } from '@rdplatforms/utils';
import { createWalkInBooking, listBookings, updateBookingStatus } from '../api/bookingsApi';
import { useAuth } from '../auth/authContext';

const STATUS_OPTIONS: BookingStatus[] = [
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'CANCELLED',
  'NO_SHOW',
];

const STATUS_COLOR: Record<BookingStatus, 'default' | 'warning' | 'success' | 'error'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  COMPLETED: 'default',
  CANCELLED: 'error',
  NO_SHOW: 'error',
};

function todayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
}

export function BookingsPage() {
  const { business } = useBusinessContext();
  const { token } = useAuth();
  const { locale } = useLocale();
  const { data: services } = useServices(business?.id ?? '');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const [customerName, setCustomerName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [preferredDate, setPreferredDate] = useState(todayDateString());
  const [preferredTime, setPreferredTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const refresh = async () => {
    if (!token || !business) return;
    setLoading(true);
    try {
      setBookings(await listBookings(token, business.id));
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, business?.id]);

  const serviceName = (id: string) => {
    const service = services?.find((s) => s.id === id);
    return service ? resolveLocalizedText(service.name, locale) : id;
  };

  const onStatusChange = async (booking: Booking, status: BookingStatus) => {
    if (!token || !business) return;
    await updateBookingStatus(token, business.id, booking.id, status);
    await refresh();
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !business) return;
    setSubmitting(true);
    setError(undefined);
    try {
      await createWalkInBooking(token, business.id, {
        customerName,
        serviceId,
        preferredDate,
        preferredTime,
      });
      setCustomerName('');
      setServiceId('');
      setPreferredTime('');
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create booking.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Bookings
      </Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Service</TableCell>
              <TableCell>Source</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>{booking.preferredDate}</TableCell>
                <TableCell>{booking.preferredTime}</TableCell>
                <TableCell>{booking.customerName}</TableCell>
                <TableCell>{serviceName(booking.serviceId)}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={booking.source}
                    variant={booking.source === 'STAFF' ? 'filled' : 'outlined'}
                  />
                </TableCell>
                <TableCell>
                  <Select
                    size="small"
                    value={booking.status}
                    onChange={(e) => onStatusChange(booking, e.target.value as BookingStatus)}
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <MenuItem key={status} value={status}>
                        <Chip size="small" color={STATUS_COLOR[status]} label={status} />
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {!loading && bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">No bookings yet.</Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 480 }}>
        <Stack spacing={2} component="form" onSubmit={onSubmit}>
          <Typography variant="h6" fontWeight={700}>
            Add a walk-in / phone-in booking
          </Typography>
          <TextField
            label="Customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            select
            label="Service"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
            fullWidth
          >
            <MenuItem value="" disabled>
              Select a service
            </MenuItem>
            {(services ?? []).map((service) => (
              <MenuItem key={service.id} value={service.id}>
                {resolveLocalizedText(service.name, locale)}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Date"
            type="date"
            value={preferredDate}
            onChange={(e) => setPreferredDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
          <TextField
            label="Time"
            type="time"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            required
            fullWidth
          />
          <Box>
            <Button type="submit" variant="contained" disabled={submitting}>
              Add booking
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
