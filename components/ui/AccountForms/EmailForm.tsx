'use client';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { updateEmail } from '@/utils/auth-helpers/server';
import { handleRequest } from '@/utils/auth-helpers/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function EmailForm({
  userEmail
}: {
  userEmail: string | undefined;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true);
    // Check if the new email is the same as the old email
    if (e.currentTarget.newEmail.value === userEmail) {
      e.preventDefault();
      setIsSubmitting(false);
      return;
    }
    handleRequest(e, updateEmail, router);
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Email Address</h3>
            <p className="text-sm text-gray-600">
              Used for login and important notifications
            </p>
          </div>
        </div>

        <form id="emailForm" onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <input
              type="email"
              name="newEmail"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 text-gray-900 placeholder-gray-400"
              defaultValue={userEmail ?? ''}
              placeholder="Enter your email address"
              maxLength={64}
            />
            <p className="mt-2 text-sm text-gray-500">
              We'll send a verification email to confirm changes
            </p>
          </div>
        </form>
      </div>

      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
        <div className="flex justify-end">
          <Button
            type="submit"
            form="emailForm"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            {isSubmitting ? 'Updating...' : 'Update Email'}
          </Button>
        </div>
      </div>
    </div>
  );
}
