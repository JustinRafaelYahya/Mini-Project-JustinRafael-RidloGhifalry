'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';
import { resetPassword } from '@/api/auth/reset-password/route';

type Inputs = {
  currentPassword: string;
  newPassword: string;
};

const schema = yup.object().shape({
  currentPassword: yup.string().required('required'),
  newPassword: yup
    .string()
    .min(8, 'At least 8 characters')
    .required('required'),
});

export default function ResetPassword() {
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');
  const [isLoading, startTransition] = React.useTransition();

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
      await resetPassword(data).then((res: any) => {
        if (!res.ok) {
          setError(res.message);
          return;
        }

        setError('');
        setSuccess(res.message);
        reset();
      });
    });
  };
  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 pt-20">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Reset your password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Current Password
              </label>
              <span className="text-red-500 text-sm">
                {errors.currentPassword?.message}
              </span>
            </div>
            <div className="mt-2">
              <input
                id="currentPassword"
                type="password"
                required
                autoComplete="currentPassword"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="********"
                {...register('currentPassword', { required: true })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                New Password
              </label>
              <span className="text-red-500 text-sm">
                {errors.newPassword?.message}
              </span>
            </div>
            <div className="mt-2">
              <input
                id="w"
                type="password"
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="********"
                {...register('newPassword', { required: true })}
              />
            </div>
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-main-color px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-main-color/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-main-color"
            >
              {isLoading ? 'Loading...' : 'Reset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
