import EditButton from '@/components/profile/EditButton';
import LogoutButton from '@/components/profile/LogoutButton';
import ShareButton from '@/components/profile/ShareButton';

export default function ProfilePage() {
  return (
    <div className="w-full max-w-7xl container mx-auto my-20 p-4">
      <div className="rounded-lg bg-[#f8f7fa] border border-gray-200 p-10 flex flex-col justify-center items-center gap-6 text-center">
        <div className="w-20 h-20 bg-gray-300 rounded-full flex justify-center items-center text-white text-xl">
          R
        </div>
        <h1 className="text-5xl font-semibold">Ridlo achmad ghifary</h1>
        <div className="flex justify-center items-center gap-8 select-none">
          <EditButton username="ridloAchmad" />
          <ShareButton url="www.google.com" />
          <LogoutButton />
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">History events visited</h2>
      </div>
    </div>
  );
}
