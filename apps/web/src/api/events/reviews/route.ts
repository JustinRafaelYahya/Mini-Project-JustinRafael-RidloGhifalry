// route.tsx
import axios from 'axios';
import Cookies from 'js-cookie';

const base_api = 'http://localhost:8000/api/';

export function getToken() {
  return Cookies.get('token');
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

export const deleteReview = async (eventId: string) => {
  const token = await getToken();
  const response = await axios.post(
    `${base_api}reviews/deleteReview`,
    { eventId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
