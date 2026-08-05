import { describe, expect, it } from 'vitest';
import { isValidSlug, toSlug } from '../src/slug';

describe('toSlug', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(toSlug('Royal Salon')).toBe('royal-salon');
  });

  it('strips non-alphanumeric characters', () => {
    expect(toSlug('Urban Bistro & Grill!')).toBe('urban-bistro-grill');
  });

  it('trims leading and trailing hyphens', () => {
    expect(toSlug('  --Vision3D Studio--  ')).toBe('vision3d-studio');
  });
});

describe('isValidSlug', () => {
  it('accepts well-formed slugs', () => {
    expect(isValidSlug('royal-salon')).toBe(true);
    expect(isValidSlug('vision3d')).toBe(true);
  });

  it('rejects slugs with spaces, casing, or double hyphens', () => {
    expect(isValidSlug('Royal Salon')).toBe(false);
    expect(isValidSlug('royal--salon')).toBe(false);
    expect(isValidSlug('-royal-salon')).toBe(false);
  });
});
