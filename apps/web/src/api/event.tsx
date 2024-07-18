import axios from 'axios';
const base_api = 'http://localhost:8000';

export async function getAllEvents(page: number = 1) {
  try {
    // Include page as a query parameter
    const res = await axios.get(base_api + '/api/events', {
      params: { page },
    });
    console.log(res);
    return res;
  } catch (err: any) {
    console.error(err);
  }
}

export async function getEventById(id: string) {
  try {
    const res = await axios.get(`${base_api}/api/events/event-detail/${id}`);
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
      page, // Include page as a query parameter
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

    const res = await axios.get(base_api + '/api/events/event-filter', {
      params,
    });

    console.log(res);
    return res;
  } catch (err: any) {
    console.error(err);
  }
}

// export async function getEventsByFilter(
//   category: string,
//   location: string,
//   date_filter: string,
//   page: number = 1,
//   query?: string,
// ) {
//   try {
//     const params: any = {
//       event_type: category,
//       page, // Include page as a query parameter
//     };

//     if (location !== 'All') {
//       params.location = location;
//     }
//     if (date_filter && date_filter !== 'all') {
//       params.date_filter = date_filter;
//     }

//     const res = await axios.get(base_api + '/api/events/event-filter', {
//       params,
//     });

//     console.log(res);
//     return res;
//   } catch (err: any) {
//     console.error(err);
//   }
// }
