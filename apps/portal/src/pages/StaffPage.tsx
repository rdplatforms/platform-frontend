import { useEffect, useState, type FormEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
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
import { useBusinessContext } from '@rdplatforms/contexts';
import {
  createStaff,
  listStaff,
  removeStaff,
  updateStaffAnalyticsAccess,
  type StaffMember,
} from '../api/staffApi';
import { useAuth } from '../auth/authContext';

export function StaffPage() {
  const { business } = useBusinessContext();
  const { token, user } = useAuth();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [canViewFullAnalytics, setCanViewFullAnalytics] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const isOwner =
    user?.superAdmin ||
    user?.memberships.some((m) => m.businessId === business?.id && m.role === 'OWNER');

  const refresh = async () => {
    if (!token || !business) return;
    setLoading(true);
    try {
      setStaff(await listStaff(token, business.id));
      setError(undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load staff.');
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
    return <Alert severity="warning">Only this business's Owner can manage staff accounts.</Alert>;
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!token || !business) return;
    setSubmitting(true);
    setError(undefined);
    try {
      await createStaff(token, business.id, { email, password, displayName, canViewFullAnalytics });
      setEmail('');
      setPassword('');
      setDisplayName('');
      setCanViewFullAnalytics(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create staff member.');
    } finally {
      setSubmitting(false);
    }
  };

  const onToggleAnalytics = async (member: StaffMember, next: boolean) => {
    if (!token || !business) return;
    await updateStaffAnalyticsAccess(token, business.id, member.membershipId, next);
    await refresh();
  };

  const onRemove = async (member: StaffMember) => {
    if (!token || !business) return;
    await removeStaff(token, business.id, member.membershipId);
    await refresh();
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight={700}>
        Staff
      </Typography>
      {error ? <Alert severity="error">{error}</Alert> : null}

      <Paper variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Full analytics access</TableCell>
              <TableCell align="right" />
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.membershipId}>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.displayName}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={member.canViewFullAnalytics}
                    onChange={(e) => onToggleAnalytics(member, e.target.checked)}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton aria-label="Remove" onClick={() => onRemove(member)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {!loading && staff.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography color="text.secondary">No staff members yet.</Typography>
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </Paper>

      <Paper variant="outlined" sx={{ p: 3, maxWidth: 480 }}>
        <Stack spacing={2} component="form" onSubmit={onSubmit}>
          <Typography variant="h6" fontWeight={700}>
            Add staff member
          </Typography>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Temporary password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={canViewFullAnalytics}
                onChange={(e) => setCanViewFullAnalytics(e.target.checked)}
              />
            }
            label="Can view full sales analytics"
          />
          <Box>
            <Button type="submit" variant="contained" disabled={submitting}>
              Add staff member
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
