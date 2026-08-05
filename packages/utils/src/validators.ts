const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const HOSTNAME_PATTERN = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})*$/i;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value);
}

export function isValidHostname(value: string): boolean {
  return HOSTNAME_PATTERN.test(value);
}

export function normalizeHostname(hostname: string): string {
  return (
    hostname
      .trim()
      .toLowerCase()
      .replace(/^www\./, '')
      .split(':')[0] ?? ''
  );
}
