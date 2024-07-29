'use client';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import signUp from '@/api/auth/register/route';
import { FormError } from '@/components/FormError';
import { FormSuccess } from '@/components/FormSuccess';

type Inputs = {
  username: string;
  role: string;
  email: string;
  password: string;
  contact_number?: string;
  referral_code?: string;
};

const schema = yup.object().shape({
  username: yup.string().required('required'),
  role: yup.string().required('required').default('CUSTOMER'),
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required').min(8, 'too short'),
  contact_number: yup.string().optional(),
  referral_code: yup.string().optional(),
});

const SignupMainPage = () => {
  const [isPhoneNumber, setIsPhoneNumber] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>('');
  const [success, setSuccess] = React.useState<string>('');
  const [isLoading, startTransition] = React.useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    startTransition(async () => {
      await signUp(data).then((res: any) => {
        if (!res.ok) {
          setError(res.message);
          return;
        }

        setError('');
        setSuccess(res.message);
      });
    });
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 pt-20">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign up to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Role
              </label>
              <span className="text-red-500">{errors.role?.message}</span>
            </div>
            <div className="mt-2">
              <select
                id="role"
                required
                disabled={isLoading}
                className="flex justify-between w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                {...register('role', { required: true })}
                onChange={(e) =>
                  e.target.value === 'ORGANIZER'
                    ? setIsPhoneNumber(true)
                    : setIsPhoneNumber(false)
                }
              >
                <option value="CUSTOMER">Customer</option>
                <option value="ORGANIZER">Organizer</option>
              </select>
            </div>
          </div>

          {isPhoneNumber && (
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
                  placeholder="62875*****"
                  {...register('contact_number', { required: true })}
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <span className="text-red-500">{errors.email?.message}</span>
            </div>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="john@gmail.com"
                {...register('email', { required: true })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              <span>{errors.email?.message}</span>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="********"
                {...register('password', { required: true })}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="referral_code"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Referral code (optional)
              </label>
              <span>{errors.referral_code?.message}</span>
            </div>
            <div className="mt-2">
              <input
                id="referral_code"
                type="text"
                autoComplete="current-referral_code"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-main-color sm:text-sm sm:leading-6 px-2 focus:outline-none"
                disabled={isLoading}
                placeholder="XXXX"
                {...register('referral_code', { required: true })}
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
              {isLoading ? 'Loading...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupMainPage;
