export function cycleNext(keys: string[], current: string): string {
  if (keys.length === 0) {
    return current;
  }
  const index = keys.indexOf(current);
  return keys[(index + 1) % keys.length] ?? (keys[0] as string);
}
