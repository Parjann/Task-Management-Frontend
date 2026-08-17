'use client';

import React from 'react';
import { TaskPriority } from '../types';

interface PriorityBadgeProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityBadge({ priority, className = '' }: PriorityBadgeProps) {
  switch (priority) {
    case 'HIGH':
    case 'URGENT':
      return (
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#EF4444] ${className}`}
        >
          {/* 3 bars active signal */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="10" width="2.5" height="4" rx="0.8" />
            <rect x="6.5" y="6" width="2.5" height="8" rx="0.8" />
            <rect x="11" y="2" width="2.5" height="12" rx="0.8" />
          </svg>
          <span>High</span>
        </div>
      );
    case 'MEDIUM':
      return (
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#F59E0B] ${className}`}
        >
          {/* 2 bars active signal */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="10" width="2.5" height="4" rx="0.8" />
            <rect x="6.5" y="6" width="2.5" height="8" rx="0.8" />
            <rect
              x="11"
              y="2"
              width="2.5"
              height="12"
              rx="0.8"
              fill="#E5E7EB"
            />
          </svg>
          <span>Medium</span>
        </div>
      );
    case 'LOW':
    default:
      return (
        <div
          className={`inline-flex items-center gap-1.5 text-xs font-semibold text-[#9CA3AF] ${className}`}
        >
          {/* 1 bar active signal */}
          <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="currentColor">
            <rect x="2" y="10" width="2.5" height="4" rx="0.8" />
            <rect
              x="6.5"
              y="6"
              width="2.5"
              height="8"
              rx="0.8"
              fill="#E5E7EB"
            />
            <rect
              x="11"
              y="2"
              width="2.5"
              height="12"
              rx="0.8"
              fill="#E5E7EB"
            />
          </svg>
          <span>Low</span>
        </div>
      );
  }
}
