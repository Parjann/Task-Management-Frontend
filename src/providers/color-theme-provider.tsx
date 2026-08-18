'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface ColorThemeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  accentColor: string;
}

export const COLOR_MAP: Record<ColorMode, { hex: string; name: string }> = {
  amber: { hex: '#F59E0B', name: 'Amber' },
  blue: { hex: '#7C3AED', name: 'Blue' }, // Purple/Blue accent matching Figma
  pink: { hex: '#EC4899', name: 'Pink' },
  rose: { hex: '#F43F5E', name: 'Rose' },
  emerald: { hex: '#10B981', name: 'Emerald' },
  black: { hex: '#18181B', name: 'Black' },
};

const ColorThemeContext = createContext<ColorThemeContextType>({
  colorMode: 'blue',
  setColorMode: () => {},
  accentColor: '#7C3AED',
});

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');

  useEffect(() => {
    const saved = localStorage.getItem('taskflow_color_mode') as ColorMode | null;
    if (saved && COLOR_MAP[saved]) {
      setColorModeState(saved);
      document.documentElement.setAttribute('data-color-mode', saved);
      document.documentElement.style.setProperty('--primary-accent', COLOR_MAP[saved].hex);
    } else {
      document.documentElement.setAttribute('data-color-mode', 'blue');
      document.documentElement.style.setProperty('--primary-accent', COLOR_MAP.blue.hex);
    }
  }, []);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem('taskflow_color_mode', mode);
    document.documentElement.setAttribute('data-color-mode', mode);
    document.documentElement.style.setProperty('--primary-accent', COLOR_MAP[mode].hex);
  };

  const accentColor = COLOR_MAP[colorMode]?.hex || '#7C3AED';

  return (
    <ColorThemeContext.Provider value={{ colorMode, setColorMode, accentColor }}>
      {/* Top Accent Line shown in Figma screenshot 2 & 3 */}
      <div
        className="fixed top-0 left-0 right-0 h-[2.5px] z-50 transition-colors duration-300 pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  return useContext(ColorThemeContext);
}
