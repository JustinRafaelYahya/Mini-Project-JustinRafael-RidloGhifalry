'use client';

import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { getEventById } from '@/api/events/get-events/route';
import { purchaseTicket, checkPurchaseStatus } from '@/api/transactions/route';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { MdOutlinePlace } from 'react-icons/md';
import {
  submitReview,
  fetchReviewStatus,
  fetchEventReviews,
  deleteReview,
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

interface Event {
  id: string;
  name: string;
  thumbnail: string;
  seats: number;
  price: number;
  tagline: string;
  about: string;
  location: string;
  start_event: string;
  start_time: string;
  end_event: string;
  end_time: string;
  organizer: {
    username: string;
  };
  discount_code: string | null;
  user_points?: number;
}

interface Review {
  id: string;
  rating: number;
  review: string;
}

const EventDetails = () => {
  const {
    error: userError,
    loading: isUserLoading,
    user,
  } = useCurrentUser() as any;

  const { id } = useParams() as { id: string };
  const router = useRouter();
  const [event, setEvent] = useState<Event | any>(null);
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
  const [reviewData, setReviewData] = useState<Review | any>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [eventReviews, setEventReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [purchasePrice, setPurchasePrice] = useState<number | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [previewPrice, setPreviewPrice] = useState<number | null>(null);
  const openPopup = () => {
    calculatePreviewPrice();
    setIsPopupOpen(true);
  };
  const closePopup = () => setIsPopupOpen(false);
  const placeholderImage = '/images/default-banner-orange.png';

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const event = await getEventById(id as string);
        setEvent(event?.data.data);

        const reviewResponse = await fetchEventReviews(id as string);
        setEventReviews(reviewResponse.reviews);
        setAverageRating(reviewResponse.averageRating);

        const token = Cookies.get('token');
        if (token) {
          setIsLoggedIn(true);
          const purchaseStatus = await checkPurchaseStatus(id as string);
          setIsPurchased(purchaseStatus.purchased);
          if (purchaseStatus.purchased) {
            setPurchasePrice(purchaseStatus.price);
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
      setPurchasePrice(purchaseResponse.data.price);
      const updatedEvent = await getEventById(id as any);
      setEvent(updatedEvent?.data.data);
    } catch (err: any) {
      console.error('Error purchasing ticket:', err);
      setPurchaseError(err.message);
    }
  };

  useEffect(() => {
    if (isPurchased) {
      (async () => {
        const purchaseStatus = await checkPurchaseStatus(id as string);
        setPurchasePrice(purchaseStatus.price);
      })();
    }
  }, [isPurchased]);

  const calculatePreviewPrice = () => {
    if (!event) return;

    let finalPrice = event.price;

    if (discountCode.trim()) {
      finalPrice *= 0.9;
    }

    if (payWithPoints && user) {
      const pointsToUse = Math.min(user.points, finalPrice);
      finalPrice -= pointsToUse;
    }

    setPreviewPrice(finalPrice);
  };

  useEffect(() => {
    calculatePreviewPrice();
  }, [discountCode, payWithPoints, event]);

  const handlePurchaseConfirmation = async () => {
    try {
      await handlePurchase();
      closePopup();
      router.reload();
    } catch (err) {
      console.error('Error confirming purchase:', err);
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

  const handleReviewDelete = async () => {
    try {
      await deleteReview(id as string);
      setSuccessMessage('Review deleted successfully!');
      setErrorMessage('');
      setRating(0);
      setReview('');
      setReviewed(false);
    } catch (error: any) {
      console.error('Error deleting review:', error);
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
            eventReviews.map((review: any) => (
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
            {purchasePrice !== undefined && (
              <div
                className={`lg:mt-2 w-full ${purchasePrice === 0 ? 'bg-blue-700 border-blue-800' : 'bg-green-700 border-green-800'} border-4 text-white font-bold p-4 rounded-xl text-center`}
              >
                {purchasePrice === 0
                  ? 'This event was free of charge!'
                  : `You were charged: ${convertToRupiah(purchasePrice)}`}
              </div>
            )}
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

                <div className="flex justify-start">
                  <MainButton
                    className="bg-main-color ease-in-out duration-300 hover:scale-105 mr-8"
                    onClick={handleReviewSubmit}
                  >
                    Submit Review
                  </MainButton>
                  {reviewed && (
                    <MainButton
                      className="bg-red-500 text-white ease-in-out duration-300 hover:scale-105 "
                      onClick={handleReviewDelete}
                    >
                      Delete Review
                    </MainButton>
                  )}
                </div>
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
                    placeholder="Enter code for 10% discount"
                    className="w-full mt-4 p-2 border border-gray-300 rounded"
                  />
                )}
                <div className="flex flex-col mt-4">
                  {user?.points ? (
                    <>
                      {' '}
                      <p className="mb-4 text-center lg:text-start">
                        You have {convertToRupiah(user?.points)} amount of
                        points
                      </p>
                      <label className="mb-2 text-center lg:text-start">
                        Do you want to partially/fully pay with points?
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
                  // onClick={handlePurchase}
                  onClick={openPopup}
                  // disabled={payWithPoints && event.user_points < event.price}
                >
                  Purchase
                </MainButton>
                <Transition appear show={isPopupOpen} as={Fragment}>
                  <Dialog
                    as="div"
                    className="relative z-10"
                    onClose={closePopup}
                  >
                    <Transition.Child
                      as={Fragment}
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                          as={Fragment}
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 scale-95"
                          enterTo="opacity-100 scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 scale-100"
                          leaveTo="opacity-0 scale-95"
                        >
                          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                              as="h3"
                              className="text-lg font-bold leading-6 text-[#f05537]"
                            >
                              eventnow
                            </Dialog.Title>
                            <div className="mt-2">
                              <p className="text-sm text-gray-500">
                                Are you sure you want to purchase this event?
                              </p>
                              <div className="mt-4">
                                <img
                                  src={event.thumbnail || placeholderImage}
                                  alt={`Event ${event.name} Thumbnail`}
                                  className="rounded-xl mb-4"
                                />
                                <p className="mb-2">Name: {event.name}</p>
                                <p className="mb-2">Tagline: {event.tagline}</p>
                                {/* <p className="mb-2">About: {event.about}</p> */}
                                <p className="mb-2 capitalize">
                                  Place: {event.location}
                                </p>
                                <p className="mb-2">
                                  From {event.start_event.substr(0, 10)} at{' '}
                                  {event.start_time.slice(0, 5)}
                                </p>
                                <p className="mb-2">
                                  To {event.end_event.substr(0, 10)} at{' '}
                                  {event.end_time.slice(0, 5)}
                                </p>
                                <p className="mb-2">
                                  By: {event.organizer.username}
                                </p>
                                <p className="text-center mt-6 font-bold text-xl text-green-700">
                                  {convertToRupiah(event.price)}
                                </p>
                                {previewPrice !== null && (
                                  <p className="text-center mt-2 font-bold text-lg text-blue-700">
                                    Final Price: {convertToRupiah(previewPrice)}
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="mt-2 flex justify-center space-x-2">
                              <MainButton
                                onClick={closePopup}
                                className="bg-red-700 hover:scale-105 ease-in-out duration-300"
                              >
                                Cancel
                              </MainButton>
                              <MainButton
                                onClick={handlePurchaseConfirmation}
                                className="bg-green-700 hover:scale-105 ease-in-out duration-300"
                              >
                                Confirm
                              </MainButton>
                            </div>
                          </Dialog.Panel>
                        </Transition.Child>
                      </div>
                    </div>
                  </Dialog>
                </Transition>
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
