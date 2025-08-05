import { Bot } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  getAuthTypes,
  getViewTypes,
  getDefaultSignInView,
  getRedirectMethod
} from '@/utils/auth-helpers/settings';
import { Card } from '@/components/ui/Card';
import PasswordSignIn from '@/components/ui/AuthForms/PasswordSignIn';
import ForgotPassword from '@/components/ui/AuthForms/ForgotPassword';
import UpdatePassword from '@/components/ui/AuthForms/UpdatePassword';
import SignUp from '@/components/ui/AuthForms/Signup';

export default async function SignIn({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ disable_button?: boolean }>;
}) {
  const { allowPassword } = getAuthTypes();
  const viewTypes = getViewTypes();
  const redirectMethod = getRedirectMethod();

  // Declare 'viewProp' and initialize with the default value
  let viewProp: string;

  // Await params since it's a Promise in Next.js 15
  const { id } = await params;
  const { disable_button } = await searchParams;

  // Assign url id to 'viewProp' if it's a valid string and ViewTypes includes it
  if (typeof id === 'string' && viewTypes.includes(id)) {
    viewProp = id;
  } else {
    const cookieStore = await cookies();
    const preferredSignInView =
      cookieStore.get('preferredSignInView')?.value || null;
    viewProp = getDefaultSignInView(preferredSignInView);
    return redirect(`/signin/${viewProp}`);
  }

  // Check if the user is already logged in and redirect to the account page if so
  const supabase = await createClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user && viewProp !== 'update_password') {
    return redirect('/dashboard');
  } else if (!user && viewProp === 'update_password') {
    return redirect('/signin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23f59e0b%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] fixed"></div>
      <div className="relative z-10 w-full max-w-md">
       
        <Card
          title={viewProp === 'forgot_password'
            ? 'Reset Your Password'
            : viewProp === 'update_password'
              ? 'Update Password'
              : viewProp === 'signup'
                ? 'Create Your Account'
                : 'Welcome Back'}
          description={viewProp === 'forgot_password'
            ? "Enter your email and we'll send you a reset link"
            : viewProp === 'update_password'
              ? 'Choose a new password for your account'
              : viewProp === 'signup'
                ? 'Start your journey with AutoAI today'
                : 'Sign in to access your dashboard'}
        >
          {viewProp === 'password_signin' && (
            <PasswordSignIn
              allowEmail={false}
              redirectMethod={redirectMethod} />
          )}
          {viewProp === 'forgot_password' && (
            <ForgotPassword
              allowEmail={false}
              redirectMethod={redirectMethod}
              disableButton={disable_button} />
          )}
          {viewProp === 'update_password' && (
            <UpdatePassword redirectMethod={redirectMethod} />
          )}
          {viewProp === 'signup' && (
            <SignUp allowEmail={false} redirectMethod={redirectMethod} />
          )}
        </Card>
      </div>
    </div>
  );
}
