import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { useLocale, useServices } from '@rdplatforms/hooks';
import {
  buildAppointmentMessage,
  resolveLocalizedText,
  toWhatsAppLink,
  translateUi,
} from '@rdplatforms/utils';
import { Button } from '../primitives/Button';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

const appointmentFormSchema = z.object({
  customerName: z.string().min(2, 'Please enter your name'),
  customerPhone: z.string().min(7, 'Please enter a valid phone number'),
  serviceId: z.string().min(1, 'Please select a service'),
  preferredDate: z.string().min(1, 'Please pick a date'),
  preferredTime: z.string().min(1, 'Please pick a time'),
  note: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

/**
 * No backend exists to receive a booking, so this hands off to WhatsApp
 * instead: the message is prefilled, but the customer taps send — nothing
 * is delivered silently. See docs/appointments.md for the full reasoning.
 */
export function Appointment({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const { data: services } = useServices(business.id);
  const [sent, setSent] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      customerName: '',
      customerPhone: '',
      serviceId: '',
      preferredDate: '',
      preferredTime: '',
      note: '',
    },
  });

  const whatsappNumber = business.contact.whatsapp ?? business.contact.phone;

  const onSubmit = handleSubmit((values) => {
    const service = services?.find((item) => item.id === values.serviceId);
    const serviceName = service ? resolveLocalizedText(service.name, locale) : values.serviceId;

    const message = buildAppointmentMessage(
      {
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        serviceName,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime,
        note: values.note || undefined,
      },
      locale,
    );

    window.open(toWhatsAppLink(whatsappNumber, message), '_blank', 'noopener,noreferrer');
    setSent(true);
    reset();
  });

  return (
    <PageSection id="appointment" tone="subtle">
      <SectionTitle
        title={resolveLocalizedText(config.title, locale) || translateUi('bookAppointment', locale)}
        subtitle={resolveLocalizedText(config.subtitle, locale)}
      />

      {sent ? (
        <Alert severity="success" onClose={() => setSent(false)} sx={{ maxWidth: 640, mx: 'auto' }}>
          {translateUi('appointmentSentMessage', locale)}
        </Alert>
      ) : (
        <Stack
          component="form"
          spacing={2}
          onSubmit={onSubmit}
          noValidate
          sx={{ maxWidth: 640, mx: 'auto' }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="customerName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={translateUi('name', locale)}
                    error={!!errors.customerName}
                    helperText={errors.customerName?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="customerPhone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={translateUi('phone', locale)}
                    error={!!errors.customerPhone}
                    helperText={errors.customerPhone?.message}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="serviceId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label={translateUi('service', locale)}
                    error={!!errors.serviceId}
                    helperText={errors.serviceId?.message}
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      {translateUi('selectService', locale)}
                    </MenuItem>
                    {(services ?? []).map((service) => (
                      <MenuItem key={service.id} value={service.id}>
                        {resolveLocalizedText(service.name, locale)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="preferredDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label={translateUi('preferredDate', locale)}
                    error={!!errors.preferredDate}
                    helperText={errors.preferredDate?.message}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Controller
                name="preferredTime"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="time"
                    label={translateUi('preferredTime', locale)}
                    error={!!errors.preferredTime}
                    helperText={errors.preferredTime?.message}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label={translateUi('noteOptional', locale)} fullWidth />
                )}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            size="large"
            disabled={isSubmitting}
            sx={{ alignSelf: { xs: 'stretch', sm: 'flex-start' } }}
          >
            {translateUi('sendViaWhatsApp', locale)}
          </Button>
        </Stack>
      )}
    </PageSection>
  );
}
