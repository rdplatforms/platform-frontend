import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, Grid, Stack, TextField, Typography } from '@mui/material';
import { formatPhoneForDisplay } from '@rdplatforms/utils';
import { Button } from '../primitives/Button';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email address'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * There is no backend to submit to yet, so this only validates and shows a
 * confirmation state. Swapping in a real submission handler later does not
 * change the form contract — see docs/future-backend-contract.md.
 */
export function Contact({ business, config }: SectionProps) {
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSubmitted(true);
    reset();
  });

  return (
    <PageSection id="contact">
      <SectionTitle title={config.title ?? 'Get In Touch'} subtitle={config.subtitle} />

      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={700}>
              {business.displayName}
            </Typography>
            <Typography color="text.secondary">
              {formatPhoneForDisplay(business.contact.phone)}
            </Typography>
            <Typography color="text.secondary">{business.contact.email}</Typography>
            <Typography color="text.secondary">
              {business.contact.address.line1}, {business.contact.address.city},{' '}
              {business.contact.address.state} {business.contact.address.postalCode}
            </Typography>
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          {submitted ? (
            <Alert severity="success" onClose={() => setSubmitted(false)}>
              Thanks for reaching out — we&apos;ll be in touch shortly.
            </Alert>
          ) : (
            <Stack component="form" spacing={2} onSubmit={onSubmit} noValidate>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Name"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Email"
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="message"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Message"
                    error={!!errors.message}
                    helperText={errors.message?.message}
                    multiline
                    minRows={4}
                    fullWidth
                  />
                )}
              />
              <Button
                type="submit"
                size="large"
                disabled={isSubmitting}
                sx={{ alignSelf: 'flex-start' }}
              >
                Send Message
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>
    </PageSection>
  );
}
