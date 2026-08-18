'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import { KanbanBoard } from '@/features/tasks/components/kanban-board';

export default function ProjectDetailPage() {
  const params = useParams();

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden">
      {/* Project Breadcrumb Navigation matching Screenshot 2 */}
      <div className="px-8 pt-5 pb-1 flex items-center gap-2 text-xs font-medium text-[#6B7280]">
        <Link
          href="/projects"
          className="hover:text-[#111827] transition-colors"
        >
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />
        <span className="text-[#111827] font-semibold">
          Design Homepage
        </span>
      </div>

      {/* Embedded Kanban & Grouped List Board for this project */}
      <KanbanBoard />
    </div>
  );
}
