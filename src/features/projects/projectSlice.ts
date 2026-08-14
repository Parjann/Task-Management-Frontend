import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Project, ProjectsState } from './types';

const initialState: ProjectsState = {
  currentProject: null,
  selectedProjectId: null,
};

export const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setCurrentProject: (state, action: PayloadAction<Project | null>) => {
      state.currentProject = action.payload;
      state.selectedProjectId = action.payload?.id || null;
    },
    setSelectedProjectId: (state, action: PayloadAction<string | null>) => {
      state.selectedProjectId = action.payload;
    },
  },
});

export const { setCurrentProject, setSelectedProjectId } = projectSlice.actions;
export default projectSlice.reducer;
