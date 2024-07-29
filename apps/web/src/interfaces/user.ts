export interface UserProps {
  id: number;
  username: string;
  profile_picture?: string;
  email: string;
  password?: string;
  role: 'CUSTOMER' | 'ORGANIZER';
  referral_number: number;
  referral_number_expired: Date | string;
  points: number;
  like_event?: number;
  use_redeem_code: boolean;
  redeem_code_expired?: Date | string;
  review_event?: number;
  event_rating?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}
