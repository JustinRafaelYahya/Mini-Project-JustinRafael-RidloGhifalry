import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Profile Page',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-7xl container mx-auto my-20 p-4">
      {children}
    </div>
  );
}
