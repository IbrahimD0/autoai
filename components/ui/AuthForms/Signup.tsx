'use client';

import Button from '@/components/ui/button';
import Input from '@/components/ui/Input';
import React from 'react';
import Link from 'next/link';
import { signUp } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Define prop type with allowEmail boolean
interface SignUpProps {
  allowEmail: boolean;
  redirectMethod: string;
}

export default function SignUp({ allowEmail, redirectMethod }: SignUpProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signUp, router);
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
            placeholder="Create a password"
            autoComplete="new-password"
            required
            helperText="Must be at least 6 characters"
          />
          <Button
            type="submit"
            className="w-full mt-6"
            loading={isSubmitting}
          >
            Create account
          </Button>
        </div>
      </form>
      <div className="space-y-3 text-center">
        <div className="pt-4 border-t border-zinc-800">
          <p className="text-sm text-zinc-500">
            Already have an account?{' '}
            <Link href="/signin/password_signin" className="text-pink-500 hover:text-pink-400 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
        {allowEmail && (
          <p>
            <Link href="/signin/email_signin" className="text-sm text-zinc-400 hover:text-pink-500 transition-colors">
              Sign in via magic link
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}
