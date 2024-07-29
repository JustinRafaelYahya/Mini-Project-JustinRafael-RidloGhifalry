'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import axios from 'axios';

const API_URL = process.env.BASE_API_URL || 'http://localhost:8000/api/';

export async function getAllEvents(page: number = 1) {
  console.log(API_URL);
  try {
    const res = await axios.get(`${API_URL}events/`, {
      params: { page },
    });

    return res;
  } catch (err: any) {
    console.error(err);
  }
}

export async function getEventById(id: string) {
  try {
    const res = await axios.get(`${API_URL}events/event-detail/${id}`);
    return res;
  } catch (err: any) {
    console.error(err);
  }
}

export async function getEventsByFilter(
  category: string,
  location: string,
  date_filter: string,
  page: number = 1,
  query: string = '',
) {
  try {
    const params: any = {
      event_type: category,
      page,
    };

    if (location !== 'All') {
      params.location = location;
    }
    if (date_filter && date_filter !== 'all') {
      params.date_filter = date_filter;
    }
    if (query) {
      params.query = query;
    }

    const res = await axios.get(`${API_URL}events/event-filter`, {
      params,
    });
    console.log(params);
    return res;
  } catch (err: any) {
    console.error(err);
  }
}

export async function updateEvent({
  body,
  path,
  id,
}: {
  body: any;
  path: string;
  id: number;
}) {
  try {
    const token = cookies().get('token')?.value;

    if (!token) {
      return null;
    }

    const res = await axios.patch(`${API_URL}events/${id}`, body, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });

    if (!res.data.ok) {
      return {
        ok: false,
        message: res.data.message,
      };
    }

    revalidatePath(path);

    return {
      ok: true,
      message: res.data.message,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.response?.data?.message || 'Something went wrong',
    };
  }
}

export async function likeEvent({ id, path }: { id: number; path: string }) {
  const token = cookies().get('token')?.value;
  if (!token) {
    return null;
  }

  try {
    const res = await axios.post(
      `${API_URL}likes/${id}`,
      {},
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );

    if (!res.data.ok) {
      return {
        ok: false,
        message: res.data.message,
      };
    }

    revalidatePath(path);

    return {
      ok: true,
      message: res.data.message,
    };
  } catch (err: any) {
    return {
      ok: false,
      message: err?.response?.data?.message || 'Something went wrong',
    };
  }
}
