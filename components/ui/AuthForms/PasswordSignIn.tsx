'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { signInWithPassword } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

// Define prop type with allowEmail boolean
interface PasswordSignInProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function PasswordSignIn({
  allowEmail,
  redirectMethod
}: PasswordSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithPassword, router);
    setIsSubmitting(false);
  };

  return (
    <div className="my-8">
      <form
        noValidate={true}
        className="mb-6"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="space-y-4">
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            required
          />
          <Input
            label="Password"
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
          <Button
            type="submit"
            className="w-full mt-6"
            loading={isSubmitting}
          >
            Sign in
          </Button>
        </div>
      </form>
      <div className="space-y-3 text-center">
        <p>
          <Link href="/signin/forgot_password" className="text-sm text-zinc-400 hover:text-pink-500 transition-colors">
            Forgot your password?
          </Link>
        </p>
        {allowEmail && (
          <p>
            <Link href="/signin/email_signin" className="text-sm text-zinc-400 hover:text-pink-500 transition-colors">
              Sign in via magic link
            </Link>
          </p>
        )}
        <div className="pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Don't have an account?{' '}
            <Link href="/signin/signup" className="text-pink-500 hover:text-pink-400 font-medium transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
