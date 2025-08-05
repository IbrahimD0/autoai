'use client';

import { Button } from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Link from 'next/link';
import { requestPasswordUpdate } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

// Define prop type with allowEmail boolean
interface ForgotPasswordProps {
  allowEmail: boolean;
  redirectMethod: string;
  disableButton?: boolean;
}

export default function ForgotPassword({
  allowEmail,
  redirectMethod,
  disableButton
}: ForgotPasswordProps) {
  const router = redirectMethod === 'client' ? useRouter() : null;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await handleRequest(e, requestPasswordUpdate, router);
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <form
        noValidate={true}
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="space-y-5">
          <Input
            label="Email Address"
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            className="text-gray-900"
            helperText="We'll send you instructions to reset your password"
            required
          />
          
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            loading={isSubmitting}
            disabled={disableButton}
          >
            Send Reset Instructions
          </Button>
        </div>
      </form>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500">Remember your password?</span>
        </div>
      </div>
      
      <div className="text-center">
        <Link 
          href="/signin/password_signin" 
          className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
