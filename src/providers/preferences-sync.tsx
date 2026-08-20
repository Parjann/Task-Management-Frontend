'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useGetProfileQuery } from '@/features/auth';
import { useAppSelector } from '@/store/hooks';
import { colorModeFromHex, useColorTheme } from './color-theme-provider';

export function PreferencesSync() {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
  const { data: profile } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const { setTheme } = useTheme();
  const { setColorMode, colorMode } = useColorTheme();

  useEffect(() => {
    if (!profile) return;
    if (profile.theme === 'DARK') setTheme('dark');
    if (profile.theme === 'LIGHT') setTheme('light');
    const mode = colorModeFromHex(profile.accentColor);
    if (mode && mode !== colorMode) setColorMode(mode);
  }, [profile, colorMode, setColorMode, setTheme]);

  return null;
}
