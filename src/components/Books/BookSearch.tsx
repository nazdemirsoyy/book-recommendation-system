import React, { useState } from 'react';
import { Input, Button, Space, message } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { searchBooks, setSearchQuery, resetBooks } from '../../store/booksSlice';

const { Search } = Input;

const BookSearch: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, searchQuery } = useAppSelector((state) => state.books);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const handleSearch = async (value: string) => {
    
    console.log('Searching for:', value);

    try {
      dispatch(setSearchQuery(value));
      await dispatch(searchBooks(value)).unwrap();
    } catch (error) {
      message.error('Failed to search books. Please try again.');
    }
  };

  const handleClear = () => {
    setLocalQuery('');
    dispatch(setSearchQuery(''));
    dispatch(resetBooks());
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(localQuery);
    }
  };

  return (
    <div style={{ marginBottom: 24 , textAlign:'center'}}>
      <Space.Compact style={{ width: '100%', maxWidth: 600 }}>
        <Search
          placeholder="Search books by title or author..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onSearch={handleSearch}
          onKeyPress={handleKeyPress}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />} loading={loading}>
              Search
            </Button>
          }
          size="large"
          allowClear
        />
        {(localQuery || searchQuery) && (
          <Button 
            icon={<ClearOutlined />} 
            onClick={handleClear}
            size="large"
          >
            Clear
          </Button>
        )}
      </Space.Compact>
      
      {searchQuery && (
        <div style={{ marginTop: 12, color: '#666' }}>
          <small>Searching for: "{searchQuery}"</small>
        </div>
      )}
    </div>
  );
};

export default BookSearch;