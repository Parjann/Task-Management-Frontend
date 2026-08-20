'use client';

import React from 'react';
import { ReduxProvider } from './redux-provider';
import { ThemeProvider } from './theme-provider';
import { ColorThemeProvider } from './color-theme-provider';
import { PreferencesSync } from './preferences-sync';
import { SocketProvider } from './socket-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <SocketProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <ColorThemeProvider>
            <PreferencesSync />
            {children}
          </ColorThemeProvider>
        </ThemeProvider>
      </SocketProvider>
    </ReduxProvider>
  );
}

export * from './color-theme-provider';
export * from './socket-provider';
