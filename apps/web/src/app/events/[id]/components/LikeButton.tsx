import { likeEvent } from '@/api/events/route';
import { UserProps } from '@/interfaces/user';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';

export default function LikeButton({
  event,
  user,
}: {
  event: any;
  user: UserProps;
}) {
  const [isUserLike, setIsUserLike] = useState<boolean>(false);
  const [likeCount, setLikeCount] = useState<number>(event?.likes || 0);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isUserLikesEvent = () => {
      if (user) {
        const isUserLike = event?.liked?.find(
          (like: any) =>
            like?.user_id === user?.id && like?.event_id === event?.id,
        );

        setIsUserLike(isUserLike);
      } else {
        setIsUserLike(false);
      }
    };

    isUserLikesEvent();
  }, [event, user]);

  const handleLikeEvent = async (id: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res = await likeEvent({ id, path: pathname || '' });
      if (res?.message === 'Event unliked') {
        setIsUserLike(false);
        setLikeCount((prevCount) => prevCount - 1);
      } else {
        setLikeCount((prevCount) => prevCount + 1);
        setIsUserLike(true);
      }
    } catch (err) {
      alert('Sorry, something went wrong. Please try again later.');
    }
  };

  return (
    <button
      onClick={() => handleLikeEvent(event.id)}
      className={`text-3xl p-1 hover:scale-105 w-fit transition duration-100 cursor-pointer flex items-center gap-2`}
    >
      <FaHeart color={isUserLike ? 'red' : 'black'} />
      <span className="text-sm text-black">{likeCount}</span>
    </button>
  );
}
