export interface User {
    username: string;
    isAuthenticated: boolean;
  }
  
export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    rememberMe: boolean;
}

export interface Book {
  id: string;
  title: string;
  authors: string[];
  authorsText: string; // For display purposes
  categories: string[];
  genre: string; // For display purposes
  averageRating: number;
  ratingsCount: number;
  description?: string;
  imageLinks?: {
    thumbnail?: string;
    smallThumbnail?: string;
  };
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
}

export interface BookSearchResponse {
  kind: string;
  totalItems: number;
  items?: any[]; // Raw Google Books API response
}

export interface BooksState {
  books: Book[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  hasSearched: boolean;
}

export interface Review {
  id: string;
  bookId: string;
  rating: number;
  review: string;
  username:string;  
  timestamp: number;
}

export interface ReviewsState {
  reviews: Review[];
}