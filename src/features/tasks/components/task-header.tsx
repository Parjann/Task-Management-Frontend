'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Columns, Filter, Plus, X } from 'lucide-react';
import {
  FieldsPopover,
  ViewMode,
  VisibleFields,
} from './fields-popover';
import {
  CascadingFilterMenu,
  CascadingFilterState,
} from './cascading-filter-menu';

interface TaskHeaderProps {
  onAddTask?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  isFieldsOpen: boolean;
  onToggleFields: () => void;
  onCloseFields: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  visibleFields: VisibleFields;
  onToggleField: (key: keyof VisibleFields) => void;
  // Cascading Filter Props
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  onCloseFilter: () => void;
  filters: CascadingFilterState;
  onFilterChange: (filters: CascadingFilterState) => void;
}

export function TaskHeader({
  onAddTask,
  searchQuery,
  onSearchChange,
  isFieldsOpen,
  onToggleFields,
  onCloseFields,
  viewMode,
  onViewModeChange,
  visibleFields,
  onToggleField,
  isFilterOpen,
  onToggleFilter,
  onCloseFilter,
  filters,
  onFilterChange,
}: TaskHeaderProps) {
  const [isSearchExpanded, setIsSearchExpanded] = useState(
    Boolean(searchQuery),
  );
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener (Cmd+F / Ctrl+F)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape' && isSearchExpanded) {
        if (!searchQuery) {
          setIsSearchExpanded(false);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchExpanded, searchQuery]);

  const handleOpenSearch = () => {
    setIsSearchExpanded(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleClearSearch = () => {
    onSearchChange('');
    inputRef.current?.focus();
  };

  const hasActiveFilters =
    filters.priority !== 'ALL' ||
    filters.status !== 'ALL' ||
    filters.member !== 'ALL' ||
    filters.label !== 'ALL';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative">
      {/* Title */}
      <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
        Tasks
      </h1>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-wrap relative">
        {/* Search Input Bar / Icon */}
        {isSearchExpanded ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#E5E7EB] bg-white w-60 sm:w-72 md:w-80 shadow-2xs focus-within:ring-2 focus-within:ring-[#7C3AED]/20 focus-within:border-[#7C3AED] transition-all">
            <Search className="w-4 h-4 text-[#9CA3AF] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full text-sm text-[#111827] placeholder:text-[#9CA3AF] bg-transparent focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={handleClearSearch}
                className="text-[#9CA3AF] hover:text-[#111827] p-0.5 rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[11px] font-semibold text-[#9CA3AF] bg-[#F9FAFB] border border-[#E5E7EB] rounded-md">
                ⌘F
              </kbd>
            )}
          </div>
        ) : (
          <button
            type="button"
            onClick={handleOpenSearch}
            className="p-2 rounded-xl border border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827] transition-colors shadow-none"
            title="Search Tasks (⌘F)"
          >
            <Search className="w-4 h-4" />
          </button>
        )}

        {/* Fields Button with List/Board View Switcher */}
        <div className="relative">
          <button
            type="button"
            onClick={onToggleFields}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-sm font-medium transition-colors shadow-none ${
              isFieldsOpen
                ? 'border-[#18181B] bg-[#F9FAFB] text-[#111827]'
                : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151] hover:text-[#111827]'
            }`}
          >
            <Columns className="w-4 h-4 text-[#6B7280]" />
            <span>Fields</span>
          </button>

          <FieldsPopover
            isOpen={isFieldsOpen}
            onClose={onCloseFields}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            visibleFields={visibleFields}
            onToggleField={onToggleField}
          />
        </div>

        {/* Filter Button with Cascading Flyout Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={onToggleFilter}
            className={`p-2 rounded-xl border transition-colors shadow-none relative ${
              isFilterOpen || hasActiveFilters
                ? 'border-[#18181B] bg-[#F9FAFB] text-[#111827]'
                : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#4B5563] hover:text-[#111827]'
            }`}
            title="Filter Tasks"
          >
            <Filter className="w-4 h-4" />
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#7C3AED] ring-2 ring-white" />
            )}
          </button>

          <CascadingFilterMenu
            isOpen={isFilterOpen}
            onClose={onCloseFilter}
            filters={filters}
            onFilterChange={onFilterChange}
          />
        </div>

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
