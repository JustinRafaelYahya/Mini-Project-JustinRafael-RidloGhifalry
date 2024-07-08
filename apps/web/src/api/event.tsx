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

export async function getEventsByType(category: any) {
  try {
    const res = await axios.get(base_api + '/api/events/' + 'event-type', {
      params: {
        event_type: category,
      },
    });

    // const res = await axios.get(base_api + '/api/events/' + `category`, {
    //   params: {
    //     event_type: category,
    //   },
    // });
    console.log(res);
    return res;
  } catch (err: any) {
    console.error(err);
  }
}
