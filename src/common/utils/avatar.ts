export const initials = (name?: string | null): null | string => {
  if (!name) {
    return null;
  }

  const trimmedName = name.trim();
  const segments = trimmedName.split(' ');

  if (segments.length === 1) {
    return trimmedName[0];
  }

  const count = segments.length;
  const firstInitial = segments[0][0] || '';
  const lastInitial = segments[count - 1][0] || '';

  return `${firstInitial}${lastInitial}`;
}
