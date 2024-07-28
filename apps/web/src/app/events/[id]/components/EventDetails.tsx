'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getEventById, purchaseTicket, checkPurchaseStatus } from '@/api/route';
import { submitReview, fetchReviewStatus } from '@/api/events/reviews/route';
import MainButton from '@/components/MainButton';
import MainLink from '@/components/LinkMain';
import React from 'react';
import ReactStars from 'react-stars'; // Adjust the path as necessary
import Cookies from 'js-cookie';
import { useCurrentUser } from '@/context/UserContext';
import LikeButton from './LikeButton';
import { convertToRupiah } from '@/utils/convert-rupiah';

const EventDetails = () => {
  const { error: userError, loading: isUserLoading, user } = useCurrentUser();

  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [discountCode, setDiscountCode] = useState('');
  const [payWithPoints, setPayWithPoints] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [purchaseError, setPurchaseError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviewed, setReviewed] = useState(false);
  const [reviewData, setReviewData] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEventById(id as string);
        setEvent(event.data.data);
        const token = Cookies.get('token');

        if (token) {
          setIsLoggedIn(true);
          const purchaseStatus = await checkPurchaseStatus(id as string);
          setIsPurchased(purchaseStatus.purchased);
          if (purchaseStatus.purchased) {
            const reviewStatus = await fetchReviewStatus(id as string);
            setReviewed(reviewStatus.reviewed);
            if (reviewStatus.reviewed) {
              setRating(reviewStatus.rating.rating);
              setReview(reviewStatus.review.review);
              setReviewData({
                rating: reviewStatus.rating,
                review: reviewStatus.review,
              });
            }
          }
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event data');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handlePurchase = async () => {
    try {
      setPurchaseError('');
      await purchaseTicket(id as any, discountCode, payWithPoints);
      setIsPurchased(true);
      const updatedEvent = await getEventById(id as any);
      setEvent(updatedEvent.data.data);
    } catch (err: any) {
      console.error('Error purchasing ticket:', err);
      setPurchaseError(err.message);
    }
  };

  const handleLoginRedirect = () => {
    router.push('/login');
  };

  const handleReviewSubmit = async () => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      const response = await submitReview(id as string, rating, review);
      setSuccessMessage(response.message);
      setReviewData(response.review);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      setErrorMessage(error.message);
    }
  };

  if (loading || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (error || userError) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>No event found</div>;
  }

  return (
    <section className="grid lg:grid-cols-2 p-4 mt-24 mx-auto max-w-[1350px] h-screen">
      <div className="mt-12"></div>
      <div className="mx-6 max-w-xl lg:pl-20">
        <div className="mx-auto">
          <MainLink className="float-left">⪡ Back to Events page</MainLink>
        </div>
        <h3 className="text-4xl font-bold mt-10">{event.name}</h3>
        <p className="mt-2 font-semibold mb-2">{event.seats} seats left</p>
        <p className="mt-2 font-semibold mb-8">
          {event.price === 0 ? 'Free' : convertToRupiah(event.price)}
        </p>
        <p className="mt-2 font-semibold mb-8">{event.price}</p>
        <div>
          <p>{event.about}</p>
        </div>
        <p className="mt-4 mb-[-1rem] text-lg font-semibold">Time and Place:</p>
        <ul className="p-5 flex flex-col list-disc">
          <li className="list-disc my-1">{event.location}</li>
          <li className="list-disc my-1">
            From {event.start_event.substr(0, 10)} at {event.start_time}
          </li>
          <li className="list-disc my-1">
            To {event.end_event.substr(0, 10)} at {event.end_time}
          </li>
        </ul>
        <p className="mt-2 font-semibold mb-2">by {event.organizer.username}</p>
        <LikeButton event={event} user={user} />
        {isPurchased ? (
          <>
            <MainButton className="lg:mt-10 w-full bg-green-500">
              Purchased
            </MainButton>
            {new Date(event.end_event) < new Date() && (
              <div className="mt-10">
                <h4 className="text-2xl font-bold">Rate and Review</h4>
                <div className="mt-4">
                  <ReactStars
                    count={5}
                    value={rating}
                    onChange={(newRating) => setRating(newRating)}
                    size={24}
                    color2={'#ffd700'}
                  />
                </div>
                <textarea
                  className="w-full mt-4 p-2 border border-gray-300 rounded"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your review here..."
                ></textarea>
                <MainButton className="mt-4" onClick={handleReviewSubmit}>
                  Submit Review
                </MainButton>
                {successMessage && (
                  <p className="mt-2 text-green-500">{successMessage}</p>
                )}
                {errorMessage && (
                  <p className="mt-2 text-red-500">{errorMessage}</p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {isLoggedIn ? (
              <>
                {event.discount_code !== null && (
                  <input
                    type="text"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    placeholder="Enter discount code"
                    className="w-full mt-4 p-2 border border-gray-300 rounded"
                  />
                )}
                <div className="flex items-center mt-4">
                  <label className="mr-2">
                    Do you want to pay with points?
                  </label>
                  <select
                    value={payWithPoints ? 'yes' : 'no'}
                    onChange={(e) => setPayWithPoints(e.target.value === 'yes')}
                    className="p-2 border border-gray-300 rounded"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {payWithPoints && (
                  <p
                    className={`mt-2 ${
                      event.user_points >= event.price
                        ? 'text-black'
                        : 'text-red-500'
                    }`}
                  >
                    You have {event.user_points} points
                    {event.user_points < event.price && ' (Not enough points)'}
                  </p>
                )}
                {purchaseError && (
                  <p className="mt-2 text-red-500">{purchaseError}</p>
                )}
                <MainButton
                  className="lg:mt-10 w-full"
                  onClick={handlePurchase}
                  disabled={payWithPoints && event.user_points < event.price}
                >
                  Purchase
                </MainButton>
              </>
            ) : (
              <MainButton
                className="lg:mt-10 w-full"
                onClick={handleLoginRedirect}
              >
                Log In to Purchase
              </MainButton>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default EventDetails;
