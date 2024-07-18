'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useTransition } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import * as yup from 'yup';

import { eventLocationProps, eventTypeProps } from '@/constants';
import { updateEvent } from '@/api/events/route';
import { FormSuccess } from '@/components/FormSuccess';
import { FormError } from '@/components/FormError';

export interface UpdateEventProps {
  name: string;
  tagline: string;
  about: string;
  event_type: string;
  thumbnail?: string | null | undefined;
  seats: number;
  start_event: string;
  end_event: string;
  start_time: string;
  end_time: string;
  price: number;
  location: string;
  tags: string | undefined;
}

export const createEventSchema = yup.object().shape({
  name: yup
    .string()
    .min(1, 'Event name is required')
    .required('Event name is required'),
  tagline: yup
    .string()
    .min(1, 'Event tagline is required')
    .required('Event tagline is required'),
  about: yup
    .string()
    .min(1, 'Event description is required')
    .required('Event description is required'),
  event_type: yup.string().required('Event type is required'),
  thumbnail: yup.string().nullable().notRequired(),
  seats: yup
    .number()
    .min(1, 'Event seats is required')
    .required('Event seats is required'),
  start_event: yup.date().required('Start event date is required'),
  end_event: yup.date().required('End event date is required'),
  start_time: yup.string().required('Start time is required'),
  end_time: yup.string().required('End time is required'),
  price: yup
    .number()
    .min(1, 'Event price is required')
    .required('Event price is required'),
  location: yup
    .string()
    .min(1, 'Event location is required')
    .required('Event location is required'),
  tags: yup.string().min(1, 'Tags is required').optional(),
});

export default function FormUpdate({ data }: { data: any }) {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, startTransition] = useTransition();

  const router = useRouter();
  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateEventProps>({
    resolver: yupResolver(createEventSchema) as any,
    defaultValues: {
      name: data?.name || '',
      tagline: data?.tagline || '',
      about: data?.about || '',
      event_type: data?.event_type || '',
      thumbnail: data?.thumbnail || '',
      seats: data?.seats || '',
      start_event: data?.start_event?.split('T')[0] || '',
      end_event: data?.end_event?.split('T')[0] || '',
      start_time: data?.start_time || '',
      end_time: data?.end_time || '',
      price: data?.price || '',
      location: data?.location || '',
      tags: data?.tags?.join(',') || '',
    },
  });

  const onSubmit: SubmitHandler<UpdateEventProps> = (data) => {
    const tag = data.tags?.split(',');
    const formattedData = {
      ...data,
      tags: tag,
    };

    startTransition(async () => {
      await updateEvent({
        body: formattedData,
        path: pathname,
        id: Number(pathname.split('/')[2]),
      })
        .then((res: any) => {
          console.log('🚀 ~ startTransition ~ res:', res);
          if (!res?.ok) {
            setError(res?.message);
            return;
          }

          setError('');
          setSuccess(res?.message);
          router.push(`/events/${pathname.split('/')[2]}`);
        })
        .catch((err) => {
          setError('Something went wrong');
        });
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid md:grid-cols-2 md:gap-5 space-y-4"
    >
      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Thumbnail
            </label>
            <span className="text-red-500 text-sm">
              {errors.thumbnail?.message}
            </span>
          </div>
          <div className="mt-2 space-y-2">
            <input
              id="thumbnail"
              type="file"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
              disabled={isLoading}
              placeholder="Your event thumbnail"
              {...register('thumbnail', { required: true })}
            />
            <Image
              src="/images/event_image_placeholder.webp"
              alt="Event image placeholder"
              width={500}
              height={500}
              className="w-full h-[300px] object-cover object-center rounded-sm"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Name
            </label>
            <span className="text-red-500 text-sm">{errors.name?.message}</span>
          </div>
          <div className="mt-2">
            <input
              id="name"
              type="text"
              required
              autoComplete="name"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
              disabled={isLoading}
              placeholder="Your event name"
              {...register('name', { required: true })}
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="tagline"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Event About
            </label>
            <span className="text-red-500 text-sm">
              {errors.about?.message}
            </span>
          </div>
          <div className="mt-2">
            <textarea
              id="about"
              required
              autoComplete="about"
              className="resize-none block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
              disabled={isLoading}
              rows={4}
              placeholder="Tell me about your event"
              {...register('about', { required: true })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="tagline"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Tagline
            </label>
            <span className="text-red-500 text-sm">
              {errors.tagline?.message}
            </span>
          </div>
          <div className="mt-2">
            <input
              id="tagline"
              type="text"
              required
              autoComplete="tagline"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
              disabled={isLoading}
              placeholder="Your event tagline"
              {...register('tagline', { required: true })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="price"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Price
              </label>
              <span className="text-red-500 text-sm">
                {errors.price?.message}
              </span>
            </div>
            <div className="mt-2">
              <input
                id="price"
                type="number"
                required
                autoComplete="price"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="5000000"
                {...register('price', { required: true })}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="seats"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Seats
              </label>
              <span className="text-red-500 text-sm">
                {errors.seats?.message}
              </span>
            </div>
            <div className="mt-2">
              <input
                id="seats"
                type="number"
                required
                autoComplete="seats"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="100"
                {...register('seats', { required: true })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="start_event"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Event
              </label>
              <span className="text-red-500 text-sm">
                {errors.start_event?.message}
              </span>
            </div>
            <div className="mt-2">
              <input
                id="start_event"
                type="date"
                required
                autoComplete="start_event"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="dd/mm/yyyy"
                {...register('start_event', { required: true })}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="end_event"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Event
              </label>
              <span className="text-red-500 text-sm">
                {errors.end_event?.message}
              </span>
            </div>
            <div className="mt-2">
              <input
                id="end_event"
                type="date"
                required
                autoComplete="end_event"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="dd/mm/yyyy"
                {...register('end_event', { required: true })}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="start_time"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Time
              </label>
              <span className="text-red-500 text-sm">
                {errors.start_time?.message}
              </span>
            </div>
            <div className="mt-2">
              <input
                id="start_time"
                type="time"
                required
                autoComplete="start_time"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="hh:mm"
                {...register('start_time', { required: true })}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="end_time"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Time
              </label>
              <span className="text-red-500 text-sm">
                {errors.end_time?.message}
              </span>
            </div>
            <div className="mt-2">
              <input
                id="end_time"
                type="time"
                required
                autoComplete="end_time"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="hh:mm"
                {...register('end_time', { required: true })}
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="event_type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Event Type
            </label>
            <span className="text-red-500 text-sm">
              {errors.event_type?.message}
            </span>
          </div>
          <div className="mt-2">
            <select
              id="event_type"
              required
              {...register('event_type', { required: true })}
              className="flex justify-between w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
              disabled={isLoading}
            >
              {eventTypeProps?.map((type: string) => (
                <option value={type} key={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="location"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Location
            </label>
            <span className="text-red-500 text-sm">
              {errors.location?.message}
            </span>
          </div>
          <div className="mt-2">
            <select
              id="location"
              required
              {...register('location', { required: true })}
              className="flex justify-between w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
              disabled={isLoading}
            >
              {eventLocationProps?.map((type: string) => (
                <option value={type} key={type} className="capitalize">
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="tags"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Tags
            </label>
            <span className="text-red-500 text-sm">{errors.tags?.message}</span>
          </div>
          <div className="mt-2">
            <input
              id="tags"
              type="text"
              required
              autoComplete="tags"
              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
              disabled={isLoading}
              placeholder="Separate tags with commas without spaces, eg. food,drink"
              {...register('tags', { required: true })}
            />
          </div>
        </div>

        <FormSuccess message={success} />
        <FormError message={error} />

        <div>
          <button
            disabled={isLoading}
            type="submit"
            className="flex w-full justify-center rounded-md bg-main-color px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-main-color/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-color"
          >
            {isLoading ? 'Loading...' : 'Update'}
          </button>
        </div>
      </div>
    </form>
  );
}
