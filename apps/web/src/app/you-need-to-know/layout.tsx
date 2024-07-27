import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Instruction you need to know',
  description:
    'Instructions for users and organizers on how to use the event organizer platform.',
};

export default function InstructionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="max-w-7xl container mx-auto my-28">{children}</div>;
}
