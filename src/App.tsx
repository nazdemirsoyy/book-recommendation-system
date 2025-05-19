import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from './store';
import { useAppDispatch } from './hooks/redux';
import { loadUserFromStorage } from './store/authSlice';
import LoginPage from './pages/LoginPage';
import BooksPage from './pages/BooksPage';
import BookDetailsPage from './pages/BookDetailsPage';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
// Ant Design CSS
import 'antd/dist/reset.css';

ModuleRegistry.registerModules([AllCommunityModule]);



const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load user from storage on app start
    dispatch(loadUserFromStorage());
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/books" element={<BooksPage />}/>
        <Route path="/books/:id" element={<BookDetailsPage />} />
        <Route path="/" element={<Navigate to="/books" replace />} />
        <Route path="*" element={<Navigate to="/books" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 8,
          },
        }}
      >
        <AppContent />
      </ConfigProvider>
    </Provider>
  );
};

export default App;