import { Metadata } from 'next';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import { Toaster } from '@/components/ui/Toasts/toaster';
import { PropsWithChildren, Suspense } from 'react';
import { getURL } from '@/utils/helpers';
import { headers } from 'next/headers';
import 'styles/main.css';

const title = 'AutoAI - Create Your Shop Website';
const description = 'AI-powered platform to create beautiful websites for local shops and restaurants.';

export const metadata: Metadata = {
  metadataBase: new URL(getURL()),
  title: title,
  description: description,
  icons: {
    icon: '/autoailogo.png',
    shortcut: '/autoailogo.png',
    apple: '/autoailogo.png',
  },
  openGraph: {
    title: title,
    description: description,
    images: ['/autoailogo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: title,
    description: description,
    images: ['/autoailogo.png'],
  }
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  
  // Check if current route is a shop page (starts with a slug that isn't a known route)
  const knownRoutes = ['/signin', '/dashboard', '/account', '/auth', '/api', '/landing'];
  const isShopPage = pathname && 
    pathname !== '/' && 
    !knownRoutes.some(route => pathname.startsWith(route));

  return (
    <html lang="en">
      <body className="bg-amber-50/30">
        {!isShopPage && <Navbar />}
        <main
          id="skip"
          className={isShopPage ? '' : 'min-h-[calc(100dvh-4rem)] md:min-h-[calc(100dvh-5rem)]'}
        >
          {children}
        </main>
        {!isShopPage && <Footer />}
        <Suspense>
          <Toaster />
        </Suspense>
      </body>
    </html>
  );
}
