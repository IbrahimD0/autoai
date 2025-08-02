'use client';

import { Button } from '@/components/ui/button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { signInWithEmail } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Define prop type with allowPassword boolean
interface EmailSignInProps {
  allowPassword: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export default function EmailSignIn({
  allowPassword,
  redirectMethod,
  disableButton
}: EmailSignInProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, signInWithEmail, router);
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
            helperText="We'll send you a magic link to sign in"
          />
          <Button
            type="submit"
            className="w-full mt-6"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Send magic link
          </Button>
        </div>
      </form>
      {allowPassword && (
        <div className="space-y-3 text-center">
          <p>
            <Link href="/signin/password_signin" className="text-sm text-zinc-400 hover:text-pink-500 transition-colors">
              Sign in with email and password
            </Link>
          </p>
          <div className="pt-4 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              Don't have an account?{' '}
              <Link href="/signin/signup" className="text-pink-500 hover:text-pink-400 font-medium transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
