import { range } from '.';

export const yearOptions = range(1900, 2025).map((year) => {
  return { value: String(year), label: String(year) };
});

export const dayOptions = range(1, 31).map((day) => {
  return { value: String(day), label: String(day) };
});

export const monthOptions = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export const timezone = () => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};
