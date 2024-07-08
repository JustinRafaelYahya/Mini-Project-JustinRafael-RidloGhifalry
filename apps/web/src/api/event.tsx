import axios from 'axios';
const base_api = 'http://localhost:8000';

export async function getAllEvents() {
  try {
    const res = await axios.get(base_api + '/api/events');
    console.log(res);
    return res;
  } catch (err: any) {
    console.error(err);
  }
}

export async function getEventsByType(category: string, location: string) {
  try {
    const params: any = {
      event_type: category,
    };

    if (location !== 'All') {
      params.location = location;
    }

    const res = await axios.get(base_api + '/api/events/event-type', {
      params,
    });

    console.log(res);
    return res;
  } catch (err: any) {
    console.error(err);
  }
}

// export async function getEventsByType(category: any, location: string) {
//   try {
//     const res = await axios.get(base_api + '/api/events/event-type', {
//       params: {
//         event_type: category,
//         location: location,
//       },
//     });

// const res = await axios.get(base_api + '/api/events/' + `category`, {
//   params: {
//     event_type: category,
//   },
// });
