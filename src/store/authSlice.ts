import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  rememberMe: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; rememberMe: boolean }>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.rememberMe = action.payload.rememberMe;
      
      // Save to localStorage based on rememberMe
      const storage = action.payload.rememberMe ? localStorage : sessionStorage;
      storage.setItem('user', JSON.stringify(action.payload.user));
      storage.setItem('isAuthenticated', 'true');
      storage.setItem('rememberMe', JSON.stringify(action.payload.rememberMe));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.rememberMe = false;
      
      // clear storage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('rememberMe');

    },
    loadUserFromStorage: (state) => {
      // Check localStorage
      let storedUser = localStorage.getItem('user');
      let storedAuth = localStorage.getItem('isAuthenticated');
      let storedRememberMe = localStorage.getItem('rememberMe');
      
      if (storedUser && storedAuth === 'true') {
        try {
          state.user = JSON.parse(storedUser);
          state.isAuthenticated = true;
          state.rememberMe = storedRememberMe ? JSON.parse(storedRememberMe) : false;
        } catch (error) {
          console.error('Error parsing user from storage:', error);
          // Clear corrupted data
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('rememberMe');
        }
      }
    },
  },
});

export const { loginSuccess, logout, loadUserFromStorage } = authSlice.actions;
export default authSlice.reducer;