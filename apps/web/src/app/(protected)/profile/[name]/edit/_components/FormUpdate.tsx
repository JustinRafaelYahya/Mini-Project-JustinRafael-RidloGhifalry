'use client';

import { updateUser } from '@/api/user/route';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import { yupResolver } from '@hookform/resolvers/yup';
import { usePathname } from 'next/navigation';
import { useState, useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';

type Inputs = {
  username: string;
  contact_number?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
};

const schema = yup.object({
  username: yup.string().required(),
  contact_number: yup.string().optional(),
  instagram: yup.string().optional(),
  facebook: yup.string().optional(),
  twitter: yup.string().optional(),
});

export default function FormUpdate({ user }: { user: any }) {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, startTransition] = useTransition();

  const pathname = usePathname();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
    defaultValues: {
      username: user?.username || '',
      contact_number: user?.contact_number || '',
      instagram: user?.instagram || '',
      facebook: user?.facebook || '',
      twitter: user?.twitter || '',
    },
  });

  const handleUpdate: SubmitHandler<Inputs> = async (data) => {
    startTransition(async () => {
      await updateUser({
        id: user?.id,
        username: data.username,
        contact_number: data.contact_number || null,
        instagram: data.instagram || null,
        facebook: data.facebook || null,
        twitter: data.twitter || null,
        path: pathname,
      }).then((res) => {
        if (!res?.ok) {
          setError(res?.message || 'Something went wrong');
        }
        setSuccess(res?.message || 'Success');
      });
    });
  };

  return (
    <>
      <div>This is will be the image</div>
      <div>
        <form className="space-y-6" onSubmit={handleSubmit(handleUpdate)}>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <span className="text-red-500">{errors.username?.message}</span>
            </div>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                required
                autoComplete="username"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="John Doe"
                {...register('username', { required: true })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email
              </label>
            </div>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-black/50"
                disabled={true}
                placeholder="John Doe"
                value={user?.email || ''}
              />
            </div>
          </div>

          {user?.role === 'ORGANIZER' && (
            <>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="contact_number"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Contact number
                  </label>
                  <span className="text-red-500">
                    {errors.contact_number?.message}
                  </span>
                </div>
                <div className="mt-2">
                  <input
                    id="contact_number"
                    type="number"
                    required
                    autoComplete="contact_number"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                    disabled={isLoading}
                    placeholder="085552223334"
                    {...register('contact_number', { required: true })}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="instagram"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Instagram link
                  </label>
                  <span className="text-red-500">
                    {errors.instagram?.message}
                  </span>
                </div>
                <div className="mt-2">
                  <input
                    id="instagram"
                    type="text"
                    autoComplete="instagram"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                    disabled={isLoading}
                    placeholder="http://instagram.com/johndoe"
                    {...register('instagram', { required: true })}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="facebook"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Facebook link
                  </label>
                  <span className="text-red-500">
                    {errors.facebook?.message}
                  </span>
                </div>
                <div className="mt-2">
                  <input
                    id="facebook"
                    type="text"
                    autoComplete="facebook"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                    disabled={isLoading}
                    placeholder="http://facebook.com/johndoe"
                    {...register('facebook', { required: true })}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="twitter"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Twitter link
                  </label>
                  <span className="text-red-500">
                    {errors.twitter?.message}
                  </span>
                </div>
                <div className="mt-2">
                  <input
                    id="twitter"
                    type="text"
                    autoComplete="twitter"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                    disabled={isLoading}
                    placeholder="http://twitter.com/johndoe"
                    {...register('twitter', { required: true })}
                  />
                </div>
              </div>
            </>
          )}

          <FormError message={error} />
          <FormSuccess message={success} />

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-main-color px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-main-color/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-color"
            >
              {isLoading ? 'Loading...' : 'Update'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
