'use client';

import { findMe } from '@/api/user/route';
import { usePathname } from 'next/navigation';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export type CurrentUserProps = {
  id: number;
  username: string;
  email: string;
  profile_picture: string;
  role: string;
  use_redeem_code: boolean;
  referral_number: number;
  referral_number_expired: string;
  redeem_code_expired?: string;
  contact_number?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  createdAt: string;
};

type CurrentUserContextProps = {
  user: CurrentUserProps;
  loading: boolean;
  error: string | null;
};

const currentUserDefaultValues: CurrentUserProps = {
  id: 0,
  username: '',
  profile_picture: '',
  email: '',
  role: '',
  use_redeem_code: false,
  redeem_code_expired: '',
  referral_number: 0,
  referral_number_expired: '',
  createdAt: '',
};

const CurrentUser = createContext<CurrentUserContextProps>({
  user: currentUserDefaultValues,
  loading: false,
  error: null,
});

export const CurrentUserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CurrentUserProps>(currentUserDefaultValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await findMe(pathname);
        setUser(data?.data?.user);
        setLoading(true);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [pathname]);

  return (
    <CurrentUser.Provider value={{ user, loading, error }}>
      {children}
    </CurrentUser.Provider>
  );
};

export function useCurrentUser() {
  return useContext(CurrentUser);
}
