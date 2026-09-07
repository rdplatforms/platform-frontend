import { useEffect, useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
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
import EditIcon from '@mui/icons-material/Edit';
import { useBusinessContext } from '@rdplatforms/contexts';
import type { NewProduct, Product } from '@rdplatforms/types';
import { formatCurrency } from '@rdplatforms/utils';
import { createProduct, deleteProduct, listProducts, updateProduct } from '../api/productsApi';
import { useAuth } from '../auth/authContext';

const EMPTY_FORM: NewProduct = {
  name: '',
  description: '',
  price: 0,
  currency: 'USD',
  imageUrl: '',
  category: '',
  stockQuantity: undefined,
  featured: false,
};

export function ProductsPage() {
  const { business } = useBusinessContext();
  const { token, user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  const [editingId, setEditingId] = useState<string>();
  const [form, setForm] = useState<NewProduct>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const isOwner =
    user?.superAdmin ||
    user?.memberships.some((m) => m.businessId === business?.id && m.role === 'OWNER');

  const refresh = async () => {
    if (!token || !business) return;
    setLoading(true);
    try {
      setProducts(await listProducts(token, business.id));
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOwner) {
      void refresh();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, business?.id, isOwner]);

  if (!isOwner) {
    return <Alert severity="warning">Only this business's Owner can manage the product catalog.</Alert>;
  }

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description ?? '',
      price: product.price,
      currency: product.currency,
      imageUrl: product.imageUrl ?? '',
      category: product.category ?? '',
      stockQuantity: product.stockQuantity,
      featured: product.featured,
    });
  };

  const cancelEdit = () => {
    setEditingId(undefined);
    setForm(EMPTY_FORM);
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !business) return;
    setSubmitting(true);
    setError(undefined);
    try {
      if (editingId) {
        await updateProduct(token, business.id, editingId, form);
      } else {
        await createProduct(token, business.id, form);
      }
      cancelEdit();
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  const onDelete = async (product: Product) => {
    if (!token || !business) return;
    try {
      await deleteProduct(token, business.id, product.id);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product.');
    }
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Products
      </Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Price</TableCell>
              <TableCell align="right">Stock</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category ?? '—'}</TableCell>
                <TableCell align="right">{formatCurrency(product.price, product.currency)}</TableCell>
                <TableCell align="right">{product.stockQuantity ?? '—'}</TableCell>
                <TableCell>{product.featured ? 'Yes' : ''}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" aria-label="Edit" onClick={() => startEdit(product)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" aria-label="Delete" onClick={() => onDelete(product)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6}>
                  <Typography color="text.secondary">No products yet.</Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 640 }}>
        <Stack spacing={2} component="form" onSubmit={onSubmit}>
          <Typography variant="h6" fontWeight={700}>
            {editingId ? 'Edit product' : 'Add product'}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                fullWidth
                multiline
                minRows={2}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                required
                fullWidth
                slotProps={{ htmlInput: { min: 0, step: '0.01' } }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <TextField
                label="Currency"
                value={form.currency}
                onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Stock (blank = unlimited)"
                type="number"
                value={form.stockQuantity ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    stockQuantity: e.target.value === '' ? undefined : Number(e.target.value),
                  }))
                }
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                fullWidth
              />
            </Grid>
          </Grid>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.featured}
                onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
              />
            }
            label="Featured"
          />
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained" disabled={submitting}>
              {editingId ? 'Save changes' : 'Add product'}
            </Button>
            {editingId ? (
              <Button variant="text" onClick={cancelEdit}>
                Cancel
              </Button>
            ) : null}
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
