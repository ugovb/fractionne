import { getServerSession } from 'next-auth/next';
import { redirect } from 'next/navigation';
import AdminClientLayout from './AdminClientLayout';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session || session.user.role !== 'admin') redirect('/app');
  return <AdminClientLayout>{children}</AdminClientLayout>;
}