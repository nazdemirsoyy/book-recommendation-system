import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import booksReducer from './booksSlice';
import reviewSlice from './reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: booksReducer,
    reviews: reviewSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;