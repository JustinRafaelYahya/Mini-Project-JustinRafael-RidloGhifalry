import { DateTimeFormatOptions } from 'intl';

const options: DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export default function formattedDate(dateString: string) {
  if (!dateString) return null;
  const data = new Date(dateString);

  const formattedDate = data.toLocaleDateString('en-US', options);
  return formattedDate;
}
