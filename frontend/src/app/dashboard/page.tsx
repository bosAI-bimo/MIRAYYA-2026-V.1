import { redirect } from 'next/navigation';

export default function DashboardPage() {
  // Redirect to a default dashboard page, for example accounting
  redirect('/dashboard/accounting');
}
