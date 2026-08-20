import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { LoginView } from '@/features/auth/components/login-view';

export default async function Home() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (token) {
    redirect('/tasks');
  }

  return <LoginView />;
}
