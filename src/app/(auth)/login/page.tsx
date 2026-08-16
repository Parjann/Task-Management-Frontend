import { Metadata } from 'next';
import { LoginView } from '@/features/auth/components/login-view';

export const metadata: Metadata = {
  title: 'Login — Pyramid',
  description: 'Login to your Pyramid task management account',
};

export default function LoginPage() {
  return <LoginView />;
}
