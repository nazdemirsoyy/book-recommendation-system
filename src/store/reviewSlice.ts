import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Review, ReviewsState } from '../types';


const initialState: ReviewsState = {
  reviews: [],
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action: PayloadAction<Omit<Review, 'id' | 'timestamp'>>) => {
      const newReview: Review = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        timestamp: Date.now(),
      };   

      // Add new review
      state.reviews.push(newReview);
    },
    removeReview: (state, action: PayloadAction<string>) => {
      state.reviews = state.reviews.filter(review => review.id !== action.payload);
    },
    updateReview: (state, action: PayloadAction<{ id: string; rating: number; review: string }>) => {
      const index = state.reviews.findIndex(review => review.id === action.payload.id);
      if (index !== -1) {
        state.reviews[index] = {
          ...state.reviews[index],
          rating: action.payload.rating,
          review: action.payload.review,
          timestamp: Date.now(),
        };
      }
    },
  },
});

export const { addReview, removeReview, updateReview } = reviewSlice.actions;

// Selectors
export const selectReviewByBookId = (state: { reviews: ReviewsState }, bookId: string) =>
  state.reviews.reviews.find(review => review.bookId === bookId);

export const selectAllReviews = (state: { reviews: ReviewsState }) => state.reviews.reviews;

export default reviewSlice.reducer;