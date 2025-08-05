import CustomerPortalForm from '@/components/ui/AccountForms/CustomerPortalForm';
import EmailForm from '@/components/ui/AccountForms/EmailForm';
import NameForm from '@/components/ui/AccountForms/NameForm';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import {
  getUserDetails,
  getSubscription,
  getUser
} from '@/utils/supabase/queries';

export default async function Account() {
  const supabase = await createClient();
  const [user, userDetails, subscription] = await Promise.all([
    getUser(supabase),
    getUserDetails(supabase),
    getSubscription(supabase)
  ]);

  if (!user) {
    return redirect('/signin');
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-16 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-center sm:text-5xl">
            Account Settings
          </h1>
          <p className="max-w-2xl m-auto mt-4 text-lg text-gray-600 sm:text-center">
            Manage your profile, subscription, and account preferences
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <CustomerPortalForm subscription={subscription} />
          <NameForm userName={userDetails?.full_name ?? ''} />
          <EmailForm userEmail={user.email} />
        </div>
      </div>
    </section>
  );
}
