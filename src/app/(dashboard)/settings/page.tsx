import React from 'react';
import { SettingsView } from '@/features/settings/components/settings-view';

export const metadata = {
  title: 'Settings — Profile',
  description: 'User settings and profile configuration',
};

export default function SettingsPage() {
  return <SettingsView />;
}
