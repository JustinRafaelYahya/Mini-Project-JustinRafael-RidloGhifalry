'use client';
import React, { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useUploadThing } from '@/lib/uploadthing';
import { createEvent } from '../../api/server-side/create-event';
import LocationDropDown from './LocationDropDown';
import locationDatas from '@/datas/make-event/LocationDatas';
import { CategoryDatas } from '@/datas/make-event/CategoryDatas';
import CategoriesDropDown from './CategoriesDropDown';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';

type Inputs = {
  name: string;
  tagline: string;
  about: string;
  event_type: string;
  thumbnail?: FileList;
  seats: number;
  start_event: Date;
  end_event: Date;
  price: number;
  location: string;
  tags: string;
};

const schema = yup.object().shape({
  name: yup.string().required('required'),
  tagline: yup.string().required('required'),
  about: yup.string().required('required'),
  event_type: yup.string().required('required'),
  thumbnail: yup.mixed(),
  seats: yup.number().required('required'),
  start_event: yup.date().required('required'),
  end_event: yup.date().required('required'),
  price: yup.number().required('required'),
  location: yup.string().required('required'),
  tags: yup.string().required('required'),
});

const MakeEventForm = () => {
  const [locations] = useState(locationDatas);
  const [categories] = useState(CategoryDatas);
  const [image, setImage] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, startTransition] = React.useTransition();
  const router = useRouter();
  const { startUpload } = useUploadThing('imageUploader');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    startTransition(async () => {
      let thumbnailUrl = 'default';
      // (data.thumbnail)
      // ([data.thumbnail])
      if (image.length > 0) {
        const uploadResult = await startUpload(image);
        thumbnailUrl = uploadResult?.[0]?.url ?? 'default';
      }
      const extractTime = (datetime: string): string => {
        return datetime.split('T')[1]; // Extracts the time part
      };
      const tagsArray = data.tags.split(',').map((tag) => tag.trim());
      const start_event_str = data.start_event.toISOString();
      const end_event_str = data.end_event.toISOString();
      const start_time = extractTime(start_event_str);
      const end_time = extractTime(end_event_str);

      await createEvent({
        name: data.name,
        tagline: data.tagline,
        about: data.about,
        event_type: data.event_type,
        thumbnail: thumbnailUrl,
        seats: data.seats,
        start_event: start_event_str,
        end_event: end_event_str,
        start_time: start_time,
        end_time: end_time,
        price: data.price,
        location: data.location,
        tags: tagsArray,
      })
        .then((res: any) => {
          if (!res.ok) {
            setError(res?.message || 'Something went wrong');
            return;
          }

          setError('');
          setSuccess(res?.message || 'Success');
          router.push('/');
        })
        .catch((err) => {
          setError(err?.message || 'Something went wrong');
        });
    });
  };

  const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage([file]);

      if (!file.type.includes('image')) return;
      fileReader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 pt-20">
        <div className="sm:mx-auto sm:w-full sm:max-w-xl">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an Event
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="name"
                  className="block text-md font-medium leading-6 text-gray-900"
                >
                  Name
                </label>
                <span className="text-red-500">{errors.name?.message}</span>
              </div>
              <div className="mt-2">
                <input
                  id="name"
                  type="text"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                  disabled={isLoading}
                  placeholder="Your Event Name"
                  {...register('name', { required: true })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="tagline"
                  className="block text-md mt-2 font-medium leading-6 text-gray-900"
                >
                  Tagline
                </label>
                <span className="text-red-500">{errors.tagline?.message}</span>
              </div>
              <div className="mt-2">
                <input
                  id="tagline"
                  type="text"
                  disabled={isLoading}
                  required
                  autoComplete="tagline"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                  placeholder="Your Event Tagline"
                  {...register('tagline', { required: true })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="about"
                  className="block text-md mt-2 font-medium leading-6 text-gray-900"
                >
                  About
                </label>
                <span className="text-red-500">{errors.about?.message}</span>
              </div>
              <div className="mt-2">
                <textarea
                  id="about"
                  disabled={isLoading}
                  required
                  autoComplete="about"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                  placeholder="Describe Your Event"
                  {...register('about', { required: true })}
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="event_type"
                  className="block text-md mt-2 font-medium leading-6 text-gray-900"
                >
                  Event Type
                </label>
                <span className="text-red-500">
                  {errors.event_type?.message}
                </span>
              </div>
              <div className="mt-2">
                <CategoriesDropDown
                  required
                  disabled={isLoading}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                  categories={categories}
                  register={register}
                  name="event_type"
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="thumbnail"
                  className="block text-md mt-2 font-medium leading-6 text-gray-900"
                >
                  Thumbnail
                </label>
                <span className="text-red-500">
                  {errors.thumbnail?.message}
                </span>
              </div>
              <div className="mt-2">
                <input
                  type="file"
                  accept="image/*"
                  // {...register('thumbnail')}
                  onChange={(e) => handleImage(e)}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="seats"
                  className="block text-md mt-2 font-medium leading-6 text-gray-900"
                >
                  Seats
                </label>
                <span className="text-red-500">{errors.seats?.message}</span>
              </div>
              <div className="mt-2">
                <input
                  id="seats"
                  type="number"
                  required
                  autoComplete="tagline"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                  placeholder="Number of Seats"
                  disabled={isLoading}
                  {...register('seats', { required: true })}
                />
              </div>
              <div>
                <label
                  htmlFor="time"
                  className="block text-md mt-2 font-medium leading-6 text-gray-900"
                >
                  Event Time
                </label>
              </div>
              <div className="mt-2 flex items-center justify-around">
                <span>
                  <div className="flex justify-center text-sm">
                    Start Time
                    <span className="text-red-500">
                      {errors.start_event?.message}
                    </span>
                  </div>
                  <input
                    id="start_event"
                    type="datetime-local"
                    required
                    autoComplete="username"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    {...register('start_event', { required: true })}
                  />
                </span>
                <span>
                  <div className="flex justify-center text-sm">
                    End Time
                    <span className="text-red-500">
                      {errors.end_event?.message}
                    </span>
                  </div>
                  <input
                    id="end_event"
                    type="datetime-local"
                    required
                    autoComplete="username"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                    {...register('end_event', { required: true })}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="price"
                  className="block text-md mt-2 font-medium leading-6 text-gray-900"
                >
                  Price
                  <span className="text-red-500">{errors.price?.message}</span>
                </label>
              </div>
              <div>
                <span className="mr-8">Rp.</span>
                <span>
                  <input
                    id="price"
                    type="number"
                    required
                    className="w-[90%] rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none mt-2"
                    placeholder="Price in IDR"
                    disabled={isLoading}
                    {...register('price', { required: true })}
                  />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="location"
                  className="block text-md mt-2 font-medium leading-6 text-gray-900"
                >
                  Location
                  <span className="text-red-500">
                    {errors.location?.message}
                  </span>
                </label>
              </div>
              <div>
                <LocationDropDown
                  required
                  disabled={isLoading}
                  className="mt-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                  locations={locations}
                  register={register}
                  name="location"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="tags"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tags
              </label>
              <span className="text-red-500 text-sm">
                {errors.tags?.message}
              </span>
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
            <FormError message={error} />
            <FormSuccess message={success} />
            <div>
              <button
                disabled={isLoading}
                type="submit"
                className="flex w-full justify-center rounded-md bg-main-color px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-main-color/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-color"
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default MakeEventForm;