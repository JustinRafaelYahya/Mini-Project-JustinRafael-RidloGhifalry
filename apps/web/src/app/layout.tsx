import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

import { Header } from '@/components/Navbar/Header';
import Footer from '@/components/Footer';
import { CurrentUserProvider } from '@/context/UserContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Eventnow',
  description: 'The Biggest Event Hub in Jabodetabek',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <CurrentUserProvider>
        <body className={inter.className}>
          <Header />
          {children}
          <Footer />
        </body>
      </CurrentUserProvider>
    </html>
  );
}
