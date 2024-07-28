export interface EventForProfileProps {
  id: number;
  name: string;
  tagline: string;
  about: string;
  event_type: string;
  thumbnail: string | null;
  seats: number;
  start_event: string;
  end_event: string;
  start_time: string;
  end_time: string;
  price: string;
  location: string;
  organizer_id: number;
  likes: number;
  shared: number;
  organizer: Organizer;
  _count: {
    attendes: number;
    like: number;
    review: number;
  };
}

export interface Organizer {
  id: number;
  username?: string;
  email?: string;
  contact_number: string;
  social_links: SocialLinks;
  followers: number;
  _count: {
    events: number;
  };
}

export interface SocialLinks {
  id: number;
  organizer_id: number;
  instagram: string;
  facebook: string;
  twitter: string;
}
