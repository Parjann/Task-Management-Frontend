import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TaskPriority, TasksState, TaskStatus } from './types';

const initialState: TasksState = {
  selectedTaskId: null,
  filterStatus: 'ALL',
  filterPriority: 'ALL',
  searchQuery: '',
};

export const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setSelectedTaskId: (state, action: PayloadAction<string | null>) => {
      state.selectedTaskId = action.payload;
    },
    setFilterStatus: (state, action: PayloadAction<TaskStatus | 'ALL'>) => {
      state.filterStatus = action.payload;
    },
    setFilterPriority: (state, action: PayloadAction<TaskPriority | 'ALL'>) => {
      state.filterPriority = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    resetFilters: (state) => {
      state.filterStatus = 'ALL';
      state.filterPriority = 'ALL';
      state.searchQuery = '';
    },
  },
});

export const {
  setSelectedTaskId,
  setFilterStatus,
  setFilterPriority,
  setSearchQuery,
  resetFilters,
} = taskSlice.actions;

export default taskSlice.reducer;
