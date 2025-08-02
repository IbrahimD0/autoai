import { redirect } from 'next/navigation';

export default function HomePage() {
  // Redirect to the landing page
  redirect('/landing');
}
