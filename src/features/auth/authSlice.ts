import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import { AuthState, User } from './types';

const token = typeof window !== 'undefined' ? Cookies.get('accessToken') || null : null;

const initialState: AuthState = {
  user: null,
  accessToken: token,
  isAuthenticated: !!token,
  isLoading: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; accessToken: string }>,
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.isAuthenticated = true;
      Cookies.set('accessToken', action.payload.accessToken, { expires: 7, path: '/' });
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      Cookies.remove('accessToken', { path: '/' });
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
