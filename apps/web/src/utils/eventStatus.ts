export function eventStatus({
  startDate,
  endDate,
  startTime,
  endTime,
}: {
  startDate: Date;
  endDate: Date;
  startTime: string;
  endTime: string;
}) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const now = new Date();
  const eventStart = new Date(`${startDate} ${startTime}`);
  const eventEnd = new Date(`${endDate} ${endTime}`);
  if (now < start) {
    return 'upcoming';
  }
  if (now > end) {
    return 'ended';
  }
  if (now > eventStart && now < eventEnd) {
    return 'ongoing';
  }
  return 'upcoming';
}
