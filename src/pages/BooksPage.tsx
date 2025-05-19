import React from 'react';
import { Card, Typography, Space, Alert } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import { useAppSelector } from '../hooks/redux';
import BookSearch from '../components/Books/BookSearch';
import BookGrid from '../components/Books/BookGrid';


const { Title, Text } = Typography;

const BooksPage: React.FC = () => {
  const { 
    books, 
    loading, 
    error, 
    searchQuery, 
    hasSearched,
    totalItems 
  } = useAppSelector((state) => state.books);

  const handleViewDetails = (bookId: string) => {
    
    // This will be handled by the grid component itself
    console.log('View book details:', bookId);
  };

  const renderContent = () => {

    if (error) {
      return (
        <Alert
          message="Error Loading Books"
          description={error}
          type="error"
          showIcon
          style={{ margin: '24px 0' }}
        />
      );
    }

    if (!hasSearched) {
      return (
        <Card style={{ textAlign: 'center', margin: '48px 0' }}>
          <Space direction="vertical" size="large">
            <BookOutlined style={{ fontSize: '64px', color: '#1890ff' }} />
            <div>
              <Title level={3}>Discover Amazing Books</Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                Search for books by title or author to get started
              </Text>
            </div>
          </Space>
        </Card>
      );
    }

    if (hasSearched && books.length === 0 && !loading) {
      return (
        <Card style={{ textAlign: 'center', margin: '48px 0' }}>
          <Space direction="vertical" size="large">
            <BookOutlined style={{ fontSize: '48px', color: '#ccc' }} />
            <div>
              <Title level={4}>No Books Found</Title>
              <Text type="secondary">
                No books found for "{searchQuery}". Try a different search term.
              </Text>
            </div>
          </Space>
        </Card>
      );
    }

    return (
      <>
        {hasSearched && totalItems > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Text strong>
              Found {totalItems.toLocaleString()} books for "{searchQuery}"
            </Text>
          </div>
        )}
        <BookGrid 
          books={books} 
          loading={loading}
          onViewDetails={handleViewDetails}
        />
      </>
    );
  };

  return (
    <div style={{ padding: '0 24px' }}>
      <Card style={{ marginBottom: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2}>
            <BookOutlined style={{ marginRight: 12 }} />
            Book Recommendation System
          </Title>
          <Text type="secondary" style={{ fontSize: '16px' }}>
            Search and discover books using the Google Books API
          </Text>
        </div>
        
        <BookSearch />
      </Card>
      
      <Card>
        {renderContent()}
      </Card>
    </div>
  );
};

export default BooksPage;