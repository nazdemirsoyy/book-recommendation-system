# Book Recommendation System

A web application built with React and TypeScript with the help Google Books API users are allowed to search books by name and author, see details and review and rate books. 


## Tech Stack

- **Frontend:**
  - React 19
  - TypeScript
  - Redux Toolkit for state management
  - React Router for navigation
  - Ant Design for UI components
  - AG Grid for data tables
  - Axios for API requests

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nazdemirsoyy/book-recommendation-system.git
   cd book-recommendation-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── store/         # Redux store configuration
├── hooks/         # Custom React hooks
├── types/         # TypeScript type definitions
├── styles/        # Global styles and CSS modules
├── backend/       # API integration
└── App.tsx        # Main application component
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from create-react-app

## Main Structure

- Pages:
    - LoginPage.tsx: Handles user authentication
    - BooksPage.tsx: Allows user to search books and display results in a grid system
    - BookDetailsPage.tsx:  Shows detailled information about selected book, user can review the book in this screen.

- Components:
    - Books
        - BookGrid: Implementation of [AG Grid](https://www.ag-grid.com/react-data-grid/getting-started/)
        - BookSearch: Implementation of Search functionality with the help of Google Books API.
        - RatingReviewSection: Implementation of Review section.

- Store: 
    - index.ts: Configures and exports the Redux Store, this allows reducers to be accesible to the whole app. 
    - authSlice.ts: Handles authentication states use localStorage to remember the user and holds username through session
    - booksSlice.ts: Handles the state of books data (search book, clear search)
    - reviewSlice.ts: Handles review and rate states (add, update, delete review)

- Hooks:
    - redux.ts: Implementing TypeScript safe version of Redux hooks, it replaces useDispatch and useSelector. 


## Acknowledgments

- [Google Books API](https://developers.google.com/books) for book data
- [Ant Design](https://ant.design/) for UI components
- [AG Grid](https://www.ag-grid.com/) for data table functionality