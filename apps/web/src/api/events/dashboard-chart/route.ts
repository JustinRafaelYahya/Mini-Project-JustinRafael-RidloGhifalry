'use server';

import axios from 'axios';
import { getCookie } from '@/actions/cookies';

const BASE_URL = process.env.BASE_API_URL || 'http://localhost:8000/api/';

export async function getEventsForChart(period: string) {
  const token = await getCookie('token');

  const res = await axios.get(`${BASE_URL}dashboard/chart?${period}=true`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });
  return res.data;
}

export async function getEventsForTable(props: string) {
  const token = await getCookie('token');

  const [sort, value] = props.split(' ');

  const res = await axios.get(`${BASE_URL}dashboard?${sort}=${value}`, {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  });

  return res.data;
}
