import React from 'react';
import { Pagination, Space, Typography } from 'antd';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { loadMoreBooks, setCurrentPage } from '../../store/booksSlice';

const { Text } = Typography;

const BookPagination: React.FC = () => {
  const dispatch = useAppDispatch();
  const { 
    currentPage, 
    totalItems, 
    itemsPerPage, 
    searchQuery, 
    loading,
    hasSearched 
  } = useAppSelector((state) => state.books);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = async (page: number) => {
    if (page !== currentPage && searchQuery) {
      dispatch(setCurrentPage(page));
      try {
        await dispatch(loadMoreBooks({ query: searchQuery, page })).unwrap();
      } catch (error) {
        console.error('Failed to load page:', error);
      }
    }
  };

  // Don't show pagination if no search has been performed or no results
  if (!hasSearched || totalItems === 0) {
    return null;
  }

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div style={{ 
      marginTop: 24, 
      textAlign: 'center',
      padding: '20px 0',
      borderTop: '1px solid #f0f0f0'
    }}>
      <Space direction="vertical" size="middle">
        <Text type="secondary">
          Showing {startItem}-{endItem} of {totalItems.toLocaleString()} books
        </Text>
        
        <Pagination
          current={currentPage}
          total={totalItems}
          pageSize={itemsPerPage}
          onChange={handlePageChange}
          showSizeChanger={false}
          showQuickJumper={totalPages > 10}
          showTotal={(total, range) => 
            `${range[0]}-${range[1]} of ${total} items`
          }
          disabled={loading}
          hideOnSinglePage={false}
          size="default"
        />
        
        {totalPages > 1 && (
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Page {currentPage} of {totalPages}
          </Text>
        )}
      </Space>
    </div>
  );
};

export default BookPagination;