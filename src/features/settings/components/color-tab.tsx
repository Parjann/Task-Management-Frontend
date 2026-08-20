'use client';

import React from 'react';
import { useColorTheme, ColorMode } from '@/providers/color-theme-provider';
import { Check } from 'lucide-react';
import { useUpdateProfileMutation } from '@/features/auth';

export function ColorTab() {
  const { colorMode, setColorMode } = useColorTheme();
  const [updateProfile] = useUpdateProfileMutation();

  const colorList: {
    id: ColorMode;
    name: string;
    hex: string;
    description: string;
  }[] = [
    { id: 'amber', name: 'Amber', hex: '#F59E0B', description: 'Warm amber accent' },
    { id: 'blue', name: 'Blue', hex: '#7C3AED', description: 'Royal purple / blue accent' },
    { id: 'pink', name: 'Pink', hex: '#EC4899', description: 'Vibrant pink accent' },
    { id: 'rose', name: 'Rose', hex: '#F43F5E', description: 'Bright rose accent' },
    { id: 'emerald', name: 'Emerald', hex: '#10B981', description: 'Fresh emerald accent' },
    { id: 'black', name: 'Black', hex: '#18181B', description: 'Minimalist monochrome' },
  ];

  return (
    <div className="max-w-3xl space-y-6 font-sans">
      <div>
        <h1 className="text-[26px] md:text-[28px] font-bold text-[#111827] tracking-tight">
          Color Mode
        </h1>
        <p className="text-xs text-[#6B7280] mt-1">
          Personalize your interface with custom accent colors across buttons, top bar, and active indicators.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {colorList.map((col) => {
          const isSelected = colorMode === col.id;
          return (
            <div
              key={col.id}
              onClick={() => {
                setColorMode(col.id);
                void updateProfile({ accentColor: col.hex });
              }}
              className={`bg-white border rounded-2xl p-4 cursor-pointer transition-all ${
                isSelected
                  ? 'border-[#18181B] ring-2 ring-[#18181B]/10 shadow-md'
                  : 'border-[#E5E7EB] hover:border-[#D1D5DB]'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-5 rounded-md shadow-xs flex-shrink-0"
                    style={{ backgroundColor: col.hex }}
                  />
                  <h3 className="text-xs font-bold text-[#111827]">{col.name}</h3>
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-[#18181B] text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#9CA3AF]">{col.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
