import axios from 'axios';
import { Book } from '../types';


// Google Books API base URL
const API_KEY= process.env.GOOGLE_BOOKS_API_KEY;
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1';

const api = axios.create({
    baseURL: GOOGLE_BOOKS_API,
    timeout: 10000,
  });
  
  export const bookService = {
    // Search books using Google Books API
    async searchBooks(query: string, startIndex: number = 0, maxResults: number = 20) {
      try {
        //console.log('Searching for:', query, 'Start index:', startIndex);

        // Build search query for title or author
        const searchQuery = query.trim();
        
        const response = await api.get('/volumes', {
          params: {
            q: searchQuery,
            startIndex,
            maxResults,
            printType: 'books',
            projection: 'full',
            key: API_KEY,
          },
        });
        
        console.log('Google Books API response:', response.data);
        
        // Transform the response to match our Book interface
        const books: Book[] = response.data.items?.map((item: any) => {
          const volumeInfo = item.volumeInfo || {};
          
          const book: Book = {
            id: item.id,
            title: volumeInfo.title || 'No Title',
            authors: volumeInfo.authors || ['Unknown Author'],
            authorsText: (volumeInfo.authors || ['Unknown Author']).join(', '),
            categories: volumeInfo.categories || ['Uncategorized'],
            genre: (volumeInfo.categories || ['Uncategorized'])[0],
            averageRating: volumeInfo.averageRating || 0,
            ratingsCount: volumeInfo.ratingsCount || 0,
            description: volumeInfo.description,
            imageLinks: volumeInfo.imageLinks,
            publishedDate: volumeInfo.publishedDate,
            publisher: volumeInfo.publisher,
            pageCount: volumeInfo.pageCount,
            language: volumeInfo.language || 'en',
          };
          
          console.log('Transformed book:', book);
          return book;
        }) || [];
        
        const result = {
          books,
          totalItems: response.data.totalItems || 0,
          query,
          startIndex,
        };
        
        console.log('Final result:', result);
        return result;
      } catch (error) {
        console.error('Error searching books:', error);
        
        // Provide more detailed error information
        if (axios.isAxiosError(error)) {
          if (error.response) {
            console.error('API Error Response:', error.response.data);
            throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
          } else if (error.request) {
            console.error('Network Error:', error.request);
            throw new Error('Network error: Unable to reach Google Books API');
          }
        }
        
        throw new Error('Failed to search books: ' + (error as Error).message);
      }
    },
  
    //Get book by ID
    async getBookById(bookId: string): Promise<Book> {
      try {
        console.log('Fetching book by ID:', bookId);
        
        const response = await api.get(`/volumes/${bookId}`, {
          params: {
            key: API_KEY,
          },
        });
        
        console.log('api response:', response.data);
        
        const item = response.data;
        const volumeInfo = item.volumeInfo || {};
        
        const book: Book = {
          id: item.id,
          title: volumeInfo.title || 'No Title',
          authors: volumeInfo.authors || ['Unknown Author'],
          authorsText: (volumeInfo.authors || ['Unknown Author']).join(', '),
          categories: volumeInfo.categories || ['Uncategorized'],
          genre: (volumeInfo.categories || ['Uncategorized'])[0],
          averageRating: volumeInfo.averageRating || 0,
          ratingsCount: volumeInfo.ratingsCount || 0,
          description: volumeInfo.description,
          imageLinks: volumeInfo.imageLinks,
          publishedDate: volumeInfo.publishedDate,
          publisher: volumeInfo.publisher,
          pageCount: volumeInfo.pageCount,
          language: volumeInfo.language || 'en',
        };
        
        return book;
      } catch (error) {
        console.error('Error fetching book by ID:', error);
        
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 404) {
            throw new Error('Book not found');
          }
          if (error.response) {
            throw new Error(`API Error: ${error.response.status} - ${error.response.statusText}`);
          } else if (error.request) {
            throw new Error('Network error: Unable to reach Google Books API');
          }
        }
        
        throw new Error('Failed to fetch book details: ' + (error as Error).message);
      }
    },
    
};