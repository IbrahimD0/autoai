'use client';

import Link from 'next/link';
import Image from 'next/image';
import { SignOut } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { usePathname, useRouter } from 'next/navigation';
import { getRedirectMethod } from '@/utils/auth-helpers/settings';

interface NavlinksProps {
  user?: any;
}

export default function Navlinks({ user }: NavlinksProps) {
  const router = getRedirectMethod() === 'client' ? useRouter() : null;
  const pathname = usePathname();

  const navLinkClass = (path: string) => {
    const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
    return `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-amber-100 text-amber-900 border border-amber-200'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;
  };

  return (
    <div className="relative flex flex-row justify-between items-center h-16">
      <div className="flex items-center gap-8">
        <Link href="/" className="flex items-center gap-2 text-amber-600 hover:text-amber-700 transition-colors" aria-label="AutoAI">
          <Image
            src="/autoailogo.png"
            alt="AutoAI Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold">AutoAI</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-2">
          <Link href="/" className={navLinkClass('/')}>
            Home
          </Link>
          <Link href="/landing" className={navLinkClass('/landing')}>
            Features
          </Link>
          {user && (
            <>
              <Link href="/dashboard" className={navLinkClass('/dashboard')}>
                Dashboard
              </Link>
              <Link href="/account" className={navLinkClass('/account')}>
                Account
              </Link>
            </>
          )}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-600 hidden md:inline">
              {user.email}
            </span>
            <form onSubmit={(e) => handleRequest(e, SignOut, router)}>
              <input type="hidden" name="pathName" value={pathname} />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </form>
          </>
        ) : (
          <>
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signin"
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg transition-colors shadow-sm"
            >
              Get Started
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
