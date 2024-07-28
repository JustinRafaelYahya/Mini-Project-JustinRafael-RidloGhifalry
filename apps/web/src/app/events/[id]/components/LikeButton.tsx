import { likeEvent } from '@/api/events/route';
import { UserProps } from '@/interfaces/user';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaHeart } from 'react-icons/fa';

export default function LikeButton({
  event,
  user,
}: {
  event: any;
  user: UserProps;
}) {
  const [isUserLike, setIsUserLike] = useState<boolean>(
    event?.liked?.some(
      (like: any) => like?.user_id === user?.id && like?.event_id === event?.id,
    ) || false,
  );
  const [likeCount, setLikeCount] = useState<number>(event?.likes || 0);

  const router = useRouter();
  const pathname = usePathname();

  const handleLikeEvent = async (id: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const res = await likeEvent({ id, path: pathname || '' });
      const newLikeCount =
        res?.message === 'Event unliked' ? likeCount - 1 : likeCount + 1;
      const newIsUserLike = res?.message === 'Event unliked' ? false : true;
      setLikeCount(newLikeCount);
      setIsUserLike(newIsUserLike);
    } catch (err) {
      alert('Sorry, something went wrong. Please try again later.');
    }
  };

  return (
    <button
      onClick={() => handleLikeEvent(event.id)}
      className="text-3xl p-1 hover:scale-105 w-fit transition duration-100 cursor-pointer flex items-center gap-2"
    >
      <FaHeart color={isUserLike ? 'red' : 'black'} />
      <span className="text-sm text-black">{likeCount}</span>
    </button>
  );
}
