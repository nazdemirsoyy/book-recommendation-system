import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BooksState } from '../types';
import { bookService } from '../backend/bookService';

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
  searchQuery: '',
  totalItems: 0,
  hasSearched: false,
};


export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async (query: string, { rejectWithValue }) => {
    try {
      console.log('Redux thunk: searching books with query:', query);
      const response = await bookService.searchBooks(query);
      console.log('Redux thunk: search response:', response);
      return response;
    } catch (error) {
      console.error('Redux thunk: search error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);


const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetBooks: (state) => {
      state.books = [];
      state.totalItems = 0;
      state.hasSearched = false;
      state.error = null;
      state.searchQuery = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // Search books cases
      .addCase(searchBooks.pending, (state) => {
        console.log('Redux: searchBooks pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(searchBooks.fulfilled, (state, action) => {
        console.log('Redux: searchBooks fulfilled with payload:', action.payload);
        state.loading = false;
        state.books = action.payload.books || [];
        state.totalItems = action.payload.totalItems;
       // state.currentPage = action.payload.currentPage;
        state.hasSearched = true;
        state.error = null;
      })
      .addCase(searchBooks.rejected, (state, action) => {
        console.log('Redux: searchBooks rejected with error:', action.payload);
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch books';
        state.hasSearched = true;
        state.books = [];
      })
  },
});

export const { setSearchQuery, clearError, resetBooks } = booksSlice.actions;
export default booksSlice.reducer;