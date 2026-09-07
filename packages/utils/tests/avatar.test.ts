import { describe, expect, it } from 'vitest';
import { getAvatarColors, getInitials } from '../src/avatar';

describe('getInitials', () => {
  it('takes the first letter of the first and last word', () => {
    expect(getInitials('Ritesh Dhekane')).toBe('RD');
  });

  it('handles a middle name by ignoring it', () => {
    expect(getInitials('Ritesh Kumar Dhekane')).toBe('RD');
  });

  it('falls back to one letter for a single-word name', () => {
    expect(getInitials('Ritesh')).toBe('R');
  });

  it('returns an empty string for blank input', () => {
    expect(getInitials('   ')).toBe('');
  });
});

describe('getAvatarColors', () => {
  it('is deterministic for the same name', () => {
    expect(getAvatarColors('Ritesh Dhekane')).toEqual(getAvatarColors('Ritesh Dhekane'));
  });

  it('always returns a bg/fg color pair', () => {
    const colors = getAvatarColors('Some Other Name');
    expect(colors.bg).toMatch(/^#/);
    expect(colors.fg).toMatch(/^#/);
  });
});
