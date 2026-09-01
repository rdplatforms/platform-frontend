import { useEffect, useMemo } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { Alert, Grid, MenuItem, Stack, TextField } from '@mui/material';
import type { SupportedLocale } from '@rdplatforms/types';
import { useLocale, useServices, useSettings, useWhatsAppSubmit } from '@rdplatforms/hooks';
import {
  buildAppointmentMessage,
  generateTimeSlots,
  getBusinessHoursForDate,
  resolveLocalizedText,
  translateUi,
} from '@rdplatforms/utils';
import { Button } from '../primitives/Button';
import { PageSection } from '../primitives/PageSection';
import { SectionTitle } from '../primitives/SectionTitle';
import type { SectionProps } from './types';

function todayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
    now.getDate(),
  ).padStart(2, '0')}`;
}

function createAppointmentFormSchema(locale: SupportedLocale) {
  const today = todayDateString();
  return z.object({
    customerName: z.string().min(2, 'Please enter your name'),
    serviceId: z.string().min(1, 'Please select a service'),
    preferredDate: z
      .string()
      .min(1, 'Please pick a date')
      .refine((value) => value >= today, translateUi('dateMustNotBePast', locale)),
    preferredTime: z.string().min(1, 'Please pick a time'),
    note: z.string().optional(),
  });
}

type AppointmentFormValues = z.infer<ReturnType<typeof createAppointmentFormSchema>>;

/**
 * No backend exists to receive a booking, so this hands off to WhatsApp
 * instead: the message is prefilled, but the customer taps send — nothing
 * is delivered silently. See docs/appointments.md for the full reasoning.
 * Available time slots come entirely from the business's own
 * BusinessHours + BusinessSettings.appointmentSlotMinutes — see
 * docs/business-hours.md.
 */
export function Appointment({ business, config }: SectionProps) {
  const { locale } = useLocale();
  const { data: services } = useServices(business.id);
  const { data: settings } = useSettings(business.id);
  const whatsappNumber = business.contact.whatsapp ?? business.contact.phone;
  const { sent, send, reset: dismissSent } = useWhatsAppSubmit(whatsappNumber);

  const schema = useMemo(() => createAppointmentFormSchema(locale), [locale]);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: '',
      serviceId: '',
      preferredDate: '',
      preferredTime: '',
      note: '',
    },
  });

  const selectedDate = useWatch({ control, name: 'preferredDate' });
  const slotMinutes = settings?.appointmentSlotMinutes ?? 60;
  const dayHours = selectedDate ? getBusinessHoursForDate(business.hours, selectedDate) : undefined;
  const isClosedOnSelectedDate = Boolean(dayHours?.isClosed);
  const timeSlots =
    dayHours && !dayHours.isClosed && dayHours.opensAt && dayHours.closesAt
      ? generateTimeSlots(dayHours.opensAt, dayHours.closesAt, slotMinutes)
      : [];

  useEffect(() => {
    setValue('preferredTime', '');
  }, [selectedDate, setValue]);

  const onSubmit = handleSubmit((values) => {
    const service = services?.find((item) => item.id === values.serviceId);
    const serviceName = service ? resolveLocalizedText(service.name, locale) : values.serviceId;

    const message = buildAppointmentMessage(
      {
        customerName: values.customerName,
        serviceName,
        preferredDate: values.preferredDate,
        preferredTime: values.preferredTime,
        note: values.note || undefined,
      },
      locale,
    );

    send(message);
    reset();
  });

  return (
    <PageSection id="appointment" tone="subtle">
      <SectionTitle
        title={resolveLocalizedText(config.title, locale) || translateUi('bookAppointment', locale)}
        subtitle={resolveLocalizedText(config.subtitle, locale)}
      />

      {sent ? (
        <Alert severity="success" onClose={dismissSent} sx={{ maxWidth: 640, mx: 'auto' }}>
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
            <Grid item xs={12}>
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
                    inputProps={{ min: todayDateString() }}
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
                    select
                    label={translateUi('preferredTime', locale)}
                    error={!!errors.preferredTime || isClosedOnSelectedDate}
                    helperText={
                      isClosedOnSelectedDate
                        ? translateUi('closedOnThisDay', locale)
                        : errors.preferredTime?.message
                    }
                    disabled={!selectedDate || isClosedOnSelectedDate}
                    fullWidth
                  >
                    <MenuItem value="" disabled>
                      {translateUi('selectTimeSlot', locale)}
                    </MenuItem>
                    {timeSlots.map((slot) => (
                      <MenuItem key={slot} value={slot}>
                        {slot}
                      </MenuItem>
                    ))}
                  </TextField>
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
          <Button type="submit" size="large" disabled={isSubmitting} sx={{ alignSelf: 'center' }}>
            {translateUi('sendViaWhatsApp', locale)}
          </Button>
        </Stack>
      )}
    </PageSection>
  );
}
