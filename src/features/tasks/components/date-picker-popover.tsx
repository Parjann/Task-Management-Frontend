'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DatePickerPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate?: Date | null;
  onSelectDate: (date: Date) => void;
}

export function DatePickerPopover({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
}: DatePickerPopoverProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate ? new Date(selectedDate) : new Date(2026, 0, 1),
  );

  if (!isOpen) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  // Days in current month
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: {
    day: number;
    isCurrentMonth: boolean;
    date: Date;
  }[] = [];

  // Previous month trailing days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    calendarDays.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month - 1, d),
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(year, month, d),
    });
  }

  // Next month leading days to complete 35 or 42 grid cells
  const remaining = 35 - calendarDays.length;
  for (let d = 1; d <= (remaining > 0 ? remaining : 42 - calendarDays.length); d++) {
    calendarDays.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month + 1, d),
    });
  }

  const isSameDay = (d1?: Date | null, d2?: Date) => {
    if (!d1 || !d2) return false;
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="absolute right-0 top-9 z-50 w-64 bg-white border border-[#E5E7EB] rounded-2xl p-4 shadow-xl animate-in fade-in zoom-in-95 duration-100 select-none">
        {/* Calendar Header with < Month Year > */}
        <div className="flex items-center justify-between mb-4 px-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-[#111827]">
            {monthNames[month]} {year}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1 rounded-lg hover:bg-[#F3F4F6] text-[#4B5563] hover:text-[#111827] transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 text-center text-xs font-medium text-[#9CA3AF] mb-2">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
          {calendarDays.map((item, idx) => {
            const isSelected = isSameDay(selectedDate, item.date);
            return (
              <div
                key={idx}
                className="flex items-center justify-center h-8"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectDate(item.date);
                    onClose();
                  }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-medium transition-all ${
                    isSelected
                      ? 'bg-[#18181B] text-white font-bold shadow-xs'
                      : item.isCurrentMonth
                      ? 'text-[#111827] hover:bg-[#F3F4F6]'
                      : 'text-[#D1D5DB] hover:bg-[#F9FAFB]'
                  }`}
                >
                  {item.day}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
