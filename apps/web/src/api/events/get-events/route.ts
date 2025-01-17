import axios from 'axios';
import Cookies from 'js-cookie';

const base_api = 'http://localhost:8000/api/';

export function getToken() {
  return Cookies.get('token');
}

export async function getAllEvents(page: number = 1) {
  console.log(base_api);
  try {
    const res = await axios.get(`${base_api}events/`, {
      params: { page },
    });

    return res;
  } catch (err: any) {
    console.error(err);
  }
}

export async function getEventById(id: string) {
  try {
    const res = await axios.get(`${base_api}events/event-detail/${id}`);
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

    const res = await axios.get(`${base_api}events/event-filter`, {
      params,
    });
    console.log(params);
    return res;
  } catch (err: any) {
    console.error(err);
  }
}
