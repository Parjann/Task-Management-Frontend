'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  AlertTriangle,
  ListTodo,
  Activity,
} from 'lucide-react';
import {
  useGetDashboardSummaryQuery,
  useGetDashboardStatusQuery,
  useGetDashboardPriorityQuery,
  useGetDashboardUpcomingQuery,
  useGetDashboardActivityQuery,
} from '../dashboardApi';

const STATUS_LABELS: Record<string, string> = {
  BACKLOG: 'Backlog',
  TODO: 'To Do',
  IN_PROGRESS: 'Doing',
  IN_REVIEW: 'In Review',
  DONE: 'Completed',
  CANCELED: 'Canceled',
};

function formatDate(value?: string | null) {
  if (!value) return 'No due date';
  return new Date(value).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
  });
}

export function DashboardView() {
  const { data: summary, isLoading } = useGetDashboardSummaryQuery();
  const { data: statusCounts = [] } = useGetDashboardStatusQuery();
  const { data: priorityCounts = [] } = useGetDashboardPriorityQuery();
  const { data: upcoming = [] } = useGetDashboardUpcomingQuery();
  const { data: activity = [] } = useGetDashboardActivityQuery();

  const cards = [
    { label: 'Projects', value: summary?.projects ?? 0, icon: FolderKanban },
    { label: 'Open tasks', value: summary?.tasks ?? 0, icon: ListTodo },
    { label: 'Completed', value: summary?.completed ?? 0, icon: CheckCircle2 },
    { label: 'Overdue', value: summary?.overdue ?? 0, icon: AlertTriangle },
    { label: 'Due today', value: summary?.dueToday ?? 0, icon: Clock },
    { label: 'Assigned to me', value: summary?.myTasks ?? 0, icon: Activity },
  ];

  const maxStatus = Math.max(1, ...statusCounts.map((s) => s.count));
  const maxPriority = Math.max(1, ...priorityCounts.map((p) => p.count));

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-white font-sans">
      <h1 className="text-[26px] font-bold text-[#111827] tracking-tight">
        Dashboard
      </h1>
      <p className="text-sm text-[#6B7280] mt-1 mb-6">
        Live workspace analytics from your projects and tasks.
      </p>

      {isLoading ? (
        <p className="text-sm text-[#9CA3AF]">Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-8">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="border border-[#E5E7EB] rounded-2xl p-4 bg-white"
                >
                  <div className="flex items-center gap-2 text-[#6B7280] mb-2">
                    <Icon className="w-4 h-4" />
                    <span className="text-xs font-medium">{card.label}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#111827]">
                    {card.value}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
            <div className="border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-[#111827] mb-4">
                Tasks by status
              </h2>
              <div className="space-y-3">
                {statusCounts.length === 0 && (
                  <p className="text-xs text-[#9CA3AF]">No task data yet.</p>
                )}
                {statusCounts.map((item) => (
                  <div key={item.status}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#374151]">
                        {STATUS_LABELS[item.status] || item.status}
                      </span>
                      <span className="font-semibold text-[#111827]">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F3F4F6]">
                      <div
                        className="h-2 rounded-full bg-[#7C3AED]"
                        style={{ width: `${(item.count / maxStatus) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-[#111827] mb-4">
                Tasks by priority
              </h2>
              <div className="space-y-3">
                {priorityCounts.length === 0 && (
                  <p className="text-xs text-[#9CA3AF]">No task data yet.</p>
                )}
                {priorityCounts.map((item) => (
                  <div key={item.priority}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#374151]">{item.priority}</span>
                      <span className="font-semibold text-[#111827]">
                        {item.count}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F3F4F6]">
                      <div
                        className="h-2 rounded-full bg-[#111827]"
                        style={{
                          width: `${(item.count / maxPriority) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-[#111827] mb-4">
                Upcoming tasks
              </h2>
              <div className="space-y-2">
                {upcoming.length === 0 && (
                  <p className="text-xs text-[#9CA3AF]">No upcoming tasks.</p>
                )}
                {upcoming.map((task) => (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-[#F9FAFB]"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#111827] truncate">
                        {task.title}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        {task.project?.name || 'Project'} · {task.priority}
                      </p>
                    </div>
                    <span className="text-xs text-[#EF4444] font-medium ml-3">
                      {formatDate(task.dueDate)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="border border-[#E5E7EB] rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-[#111827] mb-4">
                Recent activity
              </h2>
              <div className="space-y-3">
                {activity.length === 0 && (
                  <p className="text-xs text-[#9CA3AF]">No activity yet.</p>
                )}
                {activity.map((item) => (
                  <div key={item.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[11px] font-bold text-[#4B5563]">
                      {(item.user?.name || '?').charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-[#111827]">
                        <span className="font-semibold">
                          {item.user?.name || 'Someone'}
                        </span>{' '}
                        {item.message}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF]">
                        {formatDate(item.createdAt)}
                        {item.task?.title ? ` · ${item.task.title}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
