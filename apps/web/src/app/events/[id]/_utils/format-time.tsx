// utils/formatTime.ts
export const formatTime = (timeString: string) => {
  const date = new Date(`1970-01-01T${timeString}Z`);
  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
