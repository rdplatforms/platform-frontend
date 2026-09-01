import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, Grid, Stack, TextField, Typography } from '@mui/material';
import { useLocale, useWhatsAppSubmit } from '@rdplatforms/hooks';
import {
  buildContactMessage,
  formatAddressLine,
  formatPhoneForDisplay,
  resolveLocalizedText,
  translateUi,
} from '@rdplatforms/utils';
import { Button } from '../primitives/Button';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

const contactFormSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email address').optional().or(z.literal('')),
  message: z.string().min(10, 'Message should be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

/**
 * No backend exists to submit to, so — same as Appointment — this hands
 * off to WhatsApp: the message is prefilled, the visitor taps send. See
 * docs/appointments.md for the shared reasoning.
 */
export function Contact({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const addressLine = formatAddressLine(business.contact.address);
  const whatsappNumber = business.contact.whatsapp ?? business.contact.phone;
  const { sent, send, reset: dismissSent } = useWhatsAppSubmit(whatsappNumber);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: '', email: '', message: '' },
  });

  const onSubmit = handleSubmit((values) => {
    const message = buildContactMessage(
      { name: values.name, email: values.email || undefined, message: values.message },
      locale,
    );
    send(message);
    reset();
  });

  return (
    <PageSection id="contact">
      <SectionTitle
        title={resolveLocalizedText(config.title, locale) || translateUi('getInTouch', locale)}
        subtitle={resolveLocalizedText(config.subtitle, locale)}
      />

      <Grid container spacing={6}>
        <Grid item xs={12} md={5}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" fontWeight={700}>
              {business.displayName}
            </Typography>
            <Typography color="text.secondary">
              {formatPhoneForDisplay(business.contact.phone)}
            </Typography>
            {business.contact.email ? (
              <Typography color="text.secondary">{business.contact.email}</Typography>
            ) : null}
            {addressLine ? <Typography color="text.secondary">{addressLine}</Typography> : null}
          </Stack>
        </Grid>

        <Grid item xs={12} md={7}>
          {sent ? (
            <Alert severity="success" onClose={dismissSent}>
              {translateUi('contactSentMessage', locale)}
            </Alert>
          ) : (
            <Stack component="form" spacing={2} onSubmit={onSubmit} noValidate>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={translateUi('name', locale)}
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
                    label={translateUi('emailOptional', locale)}
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
                    label={translateUi('message', locale)}
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
                sx={{ alignSelf: 'center' }}
              >
                {translateUi('sendViaWhatsApp', locale)}
              </Button>
            </Stack>
          )}
        </Grid>
      </Grid>
    </PageSection>
  );
}
