import React from 'react';
import ReactStars from 'react-stars';

interface User {
  profile_picture: string | null;
  username: string;
}

interface Review {
  id: string;
  user: User;
  review: string;
  rating: number;
}

interface ReviewCardProps {
  review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const profileImage =
    review.user.profile_picture || '/images/user-placeholder-img.png';

  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <img
          src={profileImage}
          alt={`${review.user.username}'s profile picture`}
          className="w-12 h-12 rounded-full mr-4 object-cover"
        />
        <span className="font-semibold">{review.user.username}</span>
      </div>
      <div className="flex justify-between items-center mt-2">
        <p>{review.review}</p>
        <ReactStars
          count={5}
          value={review.rating}
          size={24}
          color2={'#ffd700'}
          edit={false}
        />
      </div>
    </div>
  );
};

export default ReviewCard;
