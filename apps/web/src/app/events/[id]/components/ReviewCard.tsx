const ReviewCard = ({ review }) => {
  return (
    <div className="border rounded-lg p-4 mb-4">
      <div className="flex items-center">
        <img
          src={review.user.profile_picture}
          alt={`${review.user.username}'s profile picture`}
          className="w-12 h-12 rounded-full mr-4"
        />
        <span className="font-semibold">{review.user.username}</span>
      </div>
      <p className="mt-2">{review.review}</p>
    </div>
  );
};

export default ReviewCard;
