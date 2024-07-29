'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getEventById } from '@/api/events/get-events/route';
import { purchaseTicket, checkPurchaseStatus } from '@/api/transactions/route';
import { MdOutlinePlace } from 'react-icons/md';
import {
  submitReview,
  fetchReviewStatus,
  fetchEventReviews,
} from '@/api/events/reviews/route';
import { MdEventSeat } from 'react-icons/md';
import MainButton from '@/components/MainButton';
import MainLink from '@/components/LinkMain';
import React from 'react';
import ReactStars from 'react-stars';
import Cookies from 'js-cookie';
import { useCurrentUser } from '@/context/UserContext';
import LikeButton from './LikeButton';
import { convertToRupiah } from '@/utils/convert-rupiah';
import { GoPerson } from 'react-icons/go';
import ReviewCard from './ReviewCard';
import Link from 'next/link';

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
  const [eventReviews, setEventReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const placeholderImage = '/images/default-banner-orange.png';

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEventById(id as string);
        setEvent(event?.data.data);

        // Fetch event reviews
        const reviewResponse = await fetchEventReviews(id as string);
        setEventReviews(reviewResponse.reviews);
        setAverageRating(reviewResponse.averageRating);

        // Check if user is logged in
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
      setEvent(updatedEvent?.data.data);
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
    <section className="grid lg:grid-cols-2 p-4 mt-24 lg:mb-4 mx-auto px-8 max-w-[1350px]">
      <div className="">
        <div className="mx-auto mb-12">
          <Link href="/events">
            <MainLink className="float-left">⪡ Back to Events page</MainLink>
          </Link>
        </div>
        <div className="my-4 rounded-xl">
          <img
            src={event?.thumbnail || placeholderImage}
            alt={`Event ${event.name} Thumbnail`}
            className="rounded-xl"
          />
        </div>
        <div className="mb-2 flex justify-center">
          <ReactStars
            count={5}
            value={averageRating}
            size={24}
            color2={'#ffd700'}
            edit={false}
          />
        </div>
        <div>
          {averageRating ? (
            <p className="flex justify-center mb-8">
              Averaging {averageRating.toFixed(1)} out of 5
            </p>
          ) : (
            <p className="flex justify-center mb-8">
              This event hasn't been rated yet
            </p>
          )}
        </div>
        <div className="mb-4">
          <p className="text-center font-semibold ">Recent User Reviews:</p>
        </div>
        <div className="mt-8">
          {eventReviews.length > 0 ? (
            eventReviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))
          ) : (
            <p className="text-center font-bold py-8">
              Oops, looks like there is no review for this event yet...
            </p>
          )}
        </div>
      </div>
      <div className="max-w-xl lg:pl-20 mx-auto lg:mx-2">
        <h3 className="text-4xl font-bold mt-10 text-center lg:text-start">
          {event.name}
        </h3>{' '}
        <div className="flex justify-center lg:justify-start items-center ">
          <MdEventSeat className="mr-2 text-lg" />
          <p className="mt-2 font-semibold mb-2 text-center lg:text-start">
            {event.seats} seats left
          </p>
        </div>
        <p className=" font-semibold mb-6 text-center lg:text-start">
          {event.price == 0 ? 'Free' : convertToRupiah(event.price)}
        </p>
        <p className="mt-2 font-semibold mb-4 text-center lg:text-start">
          {event.tagline}
        </p>
        <div className="text-center lg:text-start mb-4">
          <p>{event.about}</p>
        </div>
        <p className="mt-8 mb-[-1rem] text-lg font-semibold text-center lg:text-start">
          Time and Place:
        </p>
        <ul className="p-5 flex flex-col text-center lg:text-start">
          <li className="list-none my-1 capitalize">
            <div className="flex justify-center lg:justify-start lg:ml-[-1.5rem] items-center ">
              <MdOutlinePlace className="mr-2" />
              <p className="text-center lg:text-start">{event.location}</p>
            </div>
          </li>
          <li className="list-disc my-1">
            From {event.start_event.substr(0, 10)} at{' '}
            {event.start_time.slice(0, 5)}
          </li>
          <li className="list-disc my-1">
            To {event.end_event.substr(0, 10)} at {event.end_time.slice(0, 5)}
          </li>
        </ul>
        <div className="flex justify-center lg:justify-start items-center ">
          <GoPerson className="mr-2" />
          <p className="mt-2 font-semibold mb-2 text-center lg:text-start">
            By {event.organizer.username}
          </p>
        </div>
        <LikeButton event={event} user={user} />
        {isPurchased ? (
          <>
            <MainButton className="lg:mt-10 w-full bg-green-500 cursor-default">
              Purchased
            </MainButton>
            {new Date(event.end_event) < new Date() && (
              <div className="mt-10">
                <h4 className="text-2xl font-bold text-center lg:text-start">
                  Rate and Review
                </h4>
                <div className="mt-4 flex justify-center lg:justify-start">
                  <ReactStars
                    count={5}
                    value={rating}
                    onChange={(newRating) => setRating(newRating)}
                    size={24}
                    color2={'#ffd700'}
                    className="mx-auto lg:mx-0"
                  />
                </div>
                <textarea
                  className="w-full mt-4 p-2 border border-gray-300 rounded mx-auto lg:mx-0"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your review here..."
                ></textarea>

                <MainButton
                  className="bg-main-color ease-in-out duration-300 hover:scale-105  mt-4 float-right lg:float-none"
                  onClick={handleReviewSubmit}
                >
                  Submit Review
                </MainButton>
                {successMessage && (
                  <p className="mt-2 text-green-500 mx-auto lg:mx-0">
                    {successMessage}
                  </p>
                )}
                {errorMessage && (
                  <p className="mt-2 text-red-500 mx-auto lg:mx-0">
                    {errorMessage}
                  </p>
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
                <div className="flex flex-col mt-4">
                  {user?.points ? (
                    <>
                      {' '}
                      <p className="mb-4 text-center lg:text-start">
                        You have {user.points} points
                      </p>
                      <label className="mb-2 text-center lg:text-start">
                        Do you want to pay with points?
                      </label>
                      <select
                        value={payWithPoints ? 'yes' : 'no'}
                        onChange={(e) =>
                          setPayWithPoints(e.target.value === 'yes')
                        }
                        className="p-2 border border-gray-300 rounded"
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </>
                  ) : (
                    <p className="text-center lg:text-start">
                      You don't have any points
                    </p>
                  )}
                </div>

                {payWithPoints}

                {purchaseError && (
                  <p className="mt-2 text-red-500 text-center lg:text-star">
                    {purchaseError}
                  </p>
                )}
                <MainButton
                  className="lg:mt-10 w-full bg-main-color ease-in-out duration-300 hover:scale-105 "
                  onClick={handlePurchase}
                  // disabled={payWithPoints && event.user_points < event.price}
                >
                  Purchase
                </MainButton>
              </>
            ) : (
              <MainButton
                className="lg:mt-10 w-full bg-main-color ease-in-out duration-300 hover:scale-105 "
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
