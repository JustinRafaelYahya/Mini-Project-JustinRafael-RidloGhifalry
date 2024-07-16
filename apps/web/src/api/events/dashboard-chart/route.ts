'use server';

import { cookies } from 'next/headers';
import axios from 'axios';

const BASE_URL = process.env.BASE_API_URL;

export async function getEventsForChart(period: string) {
  const token = cookies().get('token')?.value;

  if (!token) {
    return null;
  }

  const res = await axios.get(
    `${BASE_URL}events/dashboard-chart?${period}=true`,
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

  const res = await axios.get(`${BASE_URL}events/dashboard?${sort}=${value}`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  return res.data;
}
