import { redirect } from 'next/navigation';

// Single default export for root page
export default function RootPage() {
  redirect('/home');
}

