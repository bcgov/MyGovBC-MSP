import { format } from 'date-fns';

export function formatDateField(date: Date) {
  if (date && date instanceof Date) {
    return format(date, 'MMMM d, yyyy');
  }
  return null;
}
