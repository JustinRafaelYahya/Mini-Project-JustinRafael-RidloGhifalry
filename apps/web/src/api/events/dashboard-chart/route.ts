'use server';

import { cookies } from 'next/headers';
import axios from 'axios';
import { getCookie } from '@/actions/cookies';

export async function getEventsForChart(period: string) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  const res = await axios.get(
    `http://localhost:8000/api/events/dashboard-chart?${period}=true`,
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );
  return res.data;
}

export async function getEventsForTable(props: string) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  const [sort, value] = props.split(' ');

  const res = await axios.get(
    `http://localhost:8000/api/events/dashboard?${sort}=${value}`,
    {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    },
  );

  return res.data;
}
