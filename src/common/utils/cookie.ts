export const getTokenFromCookie = () => {
  const match = document.cookie.match(/(^| )token=([^;]+)/);

  return match ? match[2] : null;
}

export const setCookie = (key: string, value: string = '', daysUntilExpiry: number = 1) => {
  const millisecondsPerDay = 1000 * 60 * 60 * 24;
  const expires = new Date(Date.now() + daysUntilExpiry * millisecondsPerDay).toUTCString();

  document.cookie = `${key}=${value}; path=/; Secure; expires=${expires}; SameSite=Strict`;
}