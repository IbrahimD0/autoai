'use client';

import { Button } from '@/components/ui/button';
import { signInWithOAuth } from '@/utils/auth-helpers/client';
import { type Provider } from '@supabase/supabase-js';
import { Github } from 'lucide-react';
import { useState } from 'react';

type OAuthProviders = {
  name: Provider;
  displayName: string;
  icon: JSX.Element;
};

export default function OauthSignIn() {
  const oAuthProviders: OAuthProviders[] = [
    {
      name: 'github',
      displayName: 'GitHub',
      icon: <Github className="h-5 w-5" />
    }
    /* Add desired OAuth providers here */
  ];
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSubmitting(true); // Disable the button while the request is being handled
    await signInWithOAuth(e);
    setIsSubmitting(false);
  };

  return (
    <div className="mt-6 space-y-3">
      {oAuthProviders.map((provider) => (
        <form
          key={provider.name}
          onSubmit={(e) => handleSubmit(e)}
        >
          <input type="hidden" name="provider" value={provider.name} />
          <Button
            variant="slim"
            type="submit"
            className="w-full flex items-center justify-center gap-3"
            loading={isSubmitting}
          >
            {provider.icon}
            <span>Continue with {provider.displayName}</span>
          </Button>
        </form>
      ))}
    </div>
  );
}
