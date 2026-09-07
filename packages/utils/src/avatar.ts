/** Deterministic per-name color pairing so the same person always gets the same avatar color, with no state/lookup needed. */
const AVATAR_PALETTE: { bg: string; fg: string }[] = [
  { bg: '#e7ecff', fg: '#3a4ba0' },
  { bg: '#e2f5ec', fg: '#1f8a5b' },
  { bg: '#fdeede', fg: '#bd6f28' },
  { bg: '#fde8ef', fg: '#c43e6b' },
  { bg: '#f0e7fd', fg: '#7c3aa0' },
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getAvatarColors(name: string): { bg: string; fg: string } {
  // Safe: the modulo always lands within AVATAR_PALETTE's fixed, non-empty bounds.
  return AVATAR_PALETTE[hashString(name) % AVATAR_PALETTE.length] as { bg: string; fg: string };
}

/** "Ritesh Dhekane" -> "RD"; a single word falls back to its first letter. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0];
  if (!first) {
    return '';
  }
  const last = parts.length > 1 ? parts[parts.length - 1] : undefined;
  return last ? (first.charAt(0) + last.charAt(0)).toUpperCase() : first.charAt(0).toUpperCase();
}
