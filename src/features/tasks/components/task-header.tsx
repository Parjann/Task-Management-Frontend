'use client';

import React from 'react';
import { Search, Columns, Filter, Plus } from 'lucide-react';

interface TaskHeaderProps {
  onAddTask?: () => void;
  onSearchClick?: () => void;
  onFilterClick?: () => void;
  onFieldsClick?: () => void;
}

export function TaskHeader({
  onAddTask,
  onSearchClick,
  onFilterClick,
  onFieldsClick,
}: TaskHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Title */}
      <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
        Tasks
      </h1>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Search Button */}
        <button
          type="button"
          onClick={onSearchClick}
          className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] transition-colors shadow-none"
          title="Search Tasks"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Fields Button */}
        <button
          type="button"
          onClick={onFieldsClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151] hover:text-[#111827] text-sm font-medium transition-colors shadow-none"
        >
          <Columns className="w-4 h-4 text-[#6B7280]" />
          <span>Fields</span>
        </button>

        {/* Filter Button */}
        <button
          type="button"
          onClick={onFilterClick}
          className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] transition-colors shadow-none"
          title="Filter Tasks"
        >
          <Filter className="w-4 h-4" />
        </button>

        {/* Primary + Add Task Button */}
        <button
          type="button"
          onClick={onAddTask}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#18181B] hover:bg-black text-white text-sm font-medium transition-all shadow-sm active:scale-[0.99]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </button>
      </div>
    </div>
  );
}
