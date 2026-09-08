import { useEffect, useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import type { Business, BusinessCategory } from '@rdplatforms/types';
import {
  createBusiness,
  createOwner,
  listBusinesses,
  updateBusinessStatus,
  type NewBusiness,
} from '../api/businessAdminApi';
import { useAuth } from '../auth/authContext';

/** Duplicated from platform-backend's BusinessAdminController.VALID_CATEGORIES — no shared schema between the two yet, same gap that controller's own comment already documents. */
const CATEGORIES: BusinessCategory[] = [
  'salon',
  'restaurant',
  'design-studio',
  'gym',
  'dental-clinic',
  'hotel',
  'interior-design',
  'photography',
  'legal',
  'architecture',
  'ecommerce',
  'real-estate',
];

const EMPTY_BUSINESS_FORM: NewBusiness = {
  slug: '',
  displayName: '',
  legalName: '',
  category: 'salon',
  phone: '',
};

export function BusinessesPage() {
  const { token } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState<string>();

  const [form, setForm] = useState<NewBusiness>(EMPTY_BUSINESS_FORM);
  const [submitting, setSubmitting] = useState(false);

  const [ownerDialogFor, setOwnerDialogFor] = useState<Business>();
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [ownerSubmitting, setOwnerSubmitting] = useState(false);
  const [ownerError, setOwnerError] = useState<string>();

  const refresh = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const all = await listBusinesses(token);
      setBusinesses(all.sort((a, b) => a.displayName.localeCompare(b.displayName)));
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load businesses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const onCreateBusiness = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(undefined);
    setSuccess(undefined);
    try {
      await createBusiness(token, form);
      setForm(EMPTY_BUSINESS_FORM);
      setSuccess(`"${form.displayName}" created.`);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create business.');
    } finally {
      setSubmitting(false);
    }
  };

  const onToggleActive = async (business: Business) => {
    if (!token) return;
    const nextActive = !business.isActive;
    if (
      !nextActive &&
      !window.confirm(`Suspend "${business.displayName}"? Their public site and portal stop resolving immediately.`)
    ) {
      return;
    }
    setError(undefined);
    try {
      await updateBusinessStatus(token, business.id, nextActive);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update business status.');
    }
  };

  const openOwnerDialog = (business: Business) => {
    setOwnerDialogFor(business);
    setOwnerEmail('');
    setOwnerPassword('');
    setOwnerName('');
    setOwnerError(undefined);
  };

  const onCreateOwner = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !ownerDialogFor) return;
    setOwnerSubmitting(true);
    setOwnerError(undefined);
    try {
      await createOwner(token, ownerDialogFor.id, {
        email: ownerEmail,
        password: ownerPassword,
        displayName: ownerName,
      });
      setSuccess(`Owner account ready for "${ownerDialogFor.displayName}".`);
      setOwnerDialogFor(undefined);
    } catch (err) {
      setOwnerError(err instanceof Error ? err.message : 'Failed to create owner.');
    } finally {
      setOwnerSubmitting(false);
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Businesses
      </Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}
      {success ? <Alert severity="success">{success}</Alert> : null}

      <Paper variant="outlined">
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress size={28} />
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Business</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell>{business.displayName}</TableCell>
                  <TableCell>{business.slug}</TableCell>
                  <TableCell>{business.category}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Switch
                        size="small"
                        checked={business.isActive}
                        onChange={() => onToggleActive(business)}
                      />
                      <Chip
                        size="small"
                        label={business.isActive ? 'Active' : 'Suspended'}
                        color={business.isActive ? 'success' : 'default'}
                      />
                    </Stack>
                  </TableCell>
                  <TableCell align="right">
                    <Button size="small" onClick={() => openOwnerDialog(business)}>
                      Create Owner
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {businesses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary">No businesses yet.</Typography>
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 640 }}>
        <Stack spacing={2} component="form" onSubmit={onCreateBusiness}>
          <Typography variant="h6" fontWeight={700}>
            Create a business
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Display name"
                value={form.displayName}
                onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Legal name"
                value={form.legalName}
                onChange={(e) => setForm((f) => ({ ...f, legalName: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                helperText="Lowercase letters/numbers, hyphen-separated — used in URLs and hostnames"
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as BusinessCategory }))}
                fullWidth
              >
                {CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
          </Grid>
          <Box>
            <Button type="submit" variant="contained" disabled={submitting}>
              Create business
            </Button>
          </Box>
        </Stack>
      </Paper>

      <Dialog open={Boolean(ownerDialogFor)} onClose={() => setOwnerDialogFor(undefined)} fullWidth maxWidth="xs">
        <DialogTitle>Create owner for {ownerDialogFor?.displayName}</DialogTitle>
        <Box component="form" onSubmit={onCreateOwner}>
          <DialogContent>
            <Stack spacing={2}>
              {ownerError ? <Alert severity="error">{ownerError}</Alert> : null}
              <TextField
                label="Email"
                type="email"
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Temporary password"
                type="password"
                value={ownerPassword}
                onChange={(e) => setOwnerPassword(e.target.value)}
                helperText="At least 8 characters"
                required
                fullWidth
                slotProps={{ htmlInput: { minLength: 8 } }}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOwnerDialogFor(undefined)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={ownerSubmitting}>
              Create owner
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Stack>
  );
}
