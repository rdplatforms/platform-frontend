import { describe, expect, it } from 'vitest';
import { buildAppointmentMessage } from '../src/appointment';

describe('buildAppointmentMessage', () => {
  const base = {
    customerName: 'Priya Sharma',
    serviceName: 'Hair Cutting',
    preferredDate: '2026-08-10',
    preferredTime: '15:30',
  };

  it('formats an English message with every field on its own line', () => {
    const message = buildAppointmentMessage(base, 'en');
    expect(message).toContain('New Appointment Request');
    expect(message).toContain('Name: Priya Sharma');
    expect(message).toContain('Service: Hair Cutting');
    expect(message).toContain('Preferred Date: 2026-08-10');
    expect(message).toContain('Preferred Time: 15:30');
  });

  it('does not include a phone line — WhatsApp already reveals the sender', () => {
    const message = buildAppointmentMessage(base, 'en');
    expect(message).not.toContain('Phone');
  });

  it('formats a Marathi message using Marathi labels', () => {
    const message = buildAppointmentMessage(base, 'mr');
    expect(message).toContain('नवीन भेटीची विनंती');
    expect(message).toContain('नाव: Priya Sharma');
  });

  it('omits the note line when no note is given', () => {
    const message = buildAppointmentMessage(base, 'en');
    expect(message).not.toContain('Note');
  });

  it('includes the note line when a note is given', () => {
    const message = buildAppointmentMessage({ ...base, note: 'First time visitor' }, 'en');
    expect(message).toContain('Note: First time visitor');
  });
});
