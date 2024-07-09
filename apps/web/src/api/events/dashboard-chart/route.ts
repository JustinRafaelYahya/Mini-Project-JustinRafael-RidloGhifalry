import axios from 'axios';

export async function getEventsForChart() {
  const res = await axios.get(
    'http://localhost:8000/api/events/dashboard-chart',
  );
  return res.data;
}
