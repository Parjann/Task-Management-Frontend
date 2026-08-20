export function unwrapApiData<T>(response: unknown): T {
  if (
    response &&
    typeof response === 'object' &&
    'success' in response &&
    'data' in response
  ) {
    return unwrapApiData<T>((response as { data: unknown }).data);
  }
  return response as T;
}

export function asArray<T>(value: unknown): T[] {
  const data = unwrapApiData<unknown>(value);
  if (Array.isArray(data)) return data as T[];
  if (data && typeof data === 'object') {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record.data)) return record.data as T[];
    if (Array.isArray(record.tasks)) return record.tasks as T[];
    if (Array.isArray(record.projects)) return record.projects as T[];
    if (Array.isArray(record.comments)) return record.comments as T[];
    if (Array.isArray(record.subtasks)) return record.subtasks as T[];
    if (Array.isArray(record.members)) return record.members as T[];
    if (Array.isArray(record.attachments)) return record.attachments as T[];
    if (Array.isArray(record.labels)) return record.labels as T[];
  }
  return [];
}
