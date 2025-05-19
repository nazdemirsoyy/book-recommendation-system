import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { BooksState } from '../types';
import { bookService } from '../backend/bookService';

const initialState: BooksState = {
  books: [],
  loading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  totalItems: 0,
  itemsPerPage: 20,
  hasSearched: false,
};

// Async thunk for searching books
// export const searchBooks = createAsyncThunk(
//   'books/searchBooks',
//   async ({ query, page = 1 }: { query: string; page?: number }) => {
//     const startIndex = (page - 1) * 20;
//     const response = await bookService.searchBooks(query, startIndex);
//     return { ...response, currentPage: page };
//   }
// );

export const searchBooks = createAsyncThunk(
  'books/searchBooks',
  async ({ query, page = 1 }: { query: string; page?: number }, { rejectWithValue }) => {
    try {
      console.log('Redux thunk: searching books with query:', query, 'page:', page);
      const startIndex = (page - 1) * 20;
      const response = await bookService.searchBooks(query, startIndex);
      console.log('Redux thunk: search response:', response);
      return { ...response, currentPage: page };
    } catch (error) {
      console.error('Redux thunk: search error:', error);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error occurred');
    }
  }
);

// Async thunk for loading more books (pagination)
export const loadMoreBooks = createAsyncThunk(
  'books/loadMoreBooks',
  async ({ query, page }: { query: string; page: number }, { rejectWithValue }) => {
    try {
      console.log('Redux thunk: loading more books with query:', query, 'page:', page);
      const startIndex = (page - 1) * 20;
      const response = await bookService.searchBooks(query, startIndex);
      console.log('Redux thunk: load more response:', response);
      return { ...response, currentPage: page };
    } catch (error) {
      console.error('Redux thunk: load more error:', error);
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
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetBooks: (state) => {
      state.books = [];
      state.totalItems = 0;
      state.currentPage = 1;
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
        state.currentPage = action.payload.currentPage;
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
      // Load more books cases
      .addCase(loadMoreBooks.pending, (state) => {
        console.log('Redux: loadMoreBooks pending');
        state.loading = true;
        state.error = null;
      })
      .addCase(loadMoreBooks.fulfilled, (state, action) => {
        console.log('Redux: loadMoreBooks fulfilled with payload:', action.payload);
        state.loading = false;
        state.books = action.payload.books || [];
        state.totalItems = action.payload.totalItems;
        state.currentPage = action.payload.currentPage;
        state.error = null;
      })
      .addCase(loadMoreBooks.rejected, (state, action) => {
        console.log('Redux: loadMoreBooks rejected with error:', action.payload);
        state.loading = false;
        state.error = action.payload as string || 'Failed to fetch books';
      });
  },
});

export const { setSearchQuery, setCurrentPage, clearError, resetBooks } = booksSlice.actions;
export default booksSlice.reducer;