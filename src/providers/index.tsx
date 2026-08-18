'use client';

import React from 'react';
import { ReduxProvider } from './redux-provider';
import { ThemeProvider } from './theme-provider';
import { ColorThemeProvider } from './color-theme-provider';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <ColorThemeProvider>
          {children}
        </ColorThemeProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
export * from './color-theme-provider';
