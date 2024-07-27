// route.tsx
import axios from 'axios';
import Cookies from 'js-cookie';

const base_api = 'http://localhost:8000/api/';

async function getToken() {
  const token = Cookies.get('token');
  if (!token) {
    throw new Error('Authentication token not found');
  }
  return token;
}

export const submitReview = async (
  eventId: string,
  rating: number,
  review: string,
) => {
  const token = await getToken();
  const response = await axios.post(
    `${base_api}reviews/submitReview`,
    { eventId, rating, review },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const fetchReviewStatus = async (eventId: string) => {
  const token = await getToken();
  const response = await axios.get(
    `${base_api}reviews/checkReviewStatus/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const fetchEventReviews = async (eventId: string) => {
  const token = await getToken();
  const response = await axios.get(
    `${base_api}reviews/eventReviews/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
// import axios from 'axios';
// import Cookies from 'js-cookie';

// const base_api = 'http://localhost:8000/api/';

// async function getToken() {
//   const token = Cookies.get('token');
//   if (!token) {
//     throw new Error('Authentication token not found');
//   }
//   return token;
// }

// export async function submitReview(
//   eventId: number,
//   rating: number,
//   review: string,
// ) {
//   try {
//     const token = await getToken();

//     const res = await axios.post(
//       `${base_api}reviews/submitReview`,
//       {
//         eventId,
//         rating,
//         review,
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );
//     return res.data;
//   } catch (err: any) {
//     console.error(err);
//     throw err;
//   }
// }

// export async function checkReviewStatus(eventId: number) {
//   try {
//     const token = await getToken();

//     const res = await axios.get(
//       `${base_api}reviews/checkReviewStatus/${eventId}`,
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       },
//     );
//     return res.data;
//   } catch (err: any) {
//     console.error(err);
//     throw err;
//   }
// }
