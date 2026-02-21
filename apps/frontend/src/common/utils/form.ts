export const focusField = (callback: () => void) => {
  setTimeout(() => requestAnimationFrame(() => callback()), 0);
};