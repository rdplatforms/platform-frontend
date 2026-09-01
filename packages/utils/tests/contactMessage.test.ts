import { describe, expect, it } from 'vitest';
import { buildContactMessage } from '../src/contactMessage';

describe('buildContactMessage', () => {
  it('formats name, email, and message on their own lines', () => {
    const message = buildContactMessage(
      { name: 'Priya Sharma', email: 'priya@example.com', message: 'Do you take walk-ins?' },
      'en',
    );
    expect(message).toContain('Name: Priya Sharma');
    expect(message).toContain('Email: priya@example.com');
    expect(message).toContain('Message: Do you take walk-ins?');
  });

  it('omits the email line when no email is given', () => {
    const message = buildContactMessage({ name: 'Priya Sharma', message: 'Hello' }, 'en');
    expect(message).not.toContain('Email');
  });

  it('formats a Marathi message using Marathi labels', () => {
    const message = buildContactMessage({ name: 'Priya Sharma', message: 'Hello' }, 'mr');
    expect(message).toContain('नाव: Priya Sharma');
    expect(message).toContain('मेसेज: Hello');
  });
});
