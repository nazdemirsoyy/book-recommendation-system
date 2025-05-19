import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Image, Typography, Space, Divider, Tag, Spin, Alert } from 'antd';
import { ArrowLeftOutlined, BookOutlined, CalendarOutlined, UserOutlined } from '@ant-design/icons';
import { Book } from '../types';
import { bookService } from '../backend/bookService';
import RatingReviewSection from '../components/Books/RatingReviewSection';

const { Title, Text } = Typography;

const BookDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        // You'll need to implement this method in your bookService
        const bookDetails = await bookService.getBookById(id);
        setBook(bookDetails);
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" onClick={handleBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  if (!book) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Book Not Found"
          description="The requested book could not be found."
          type="warning"
          showIcon
          action={
            <Button size="small" onClick={handleBack}>
              Go Back
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* back button */}
      <div style={{ marginBottom: '24px' }}>
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          style={{ marginBottom: '16px' }}
        >
          Back to Search Results
        </Button>
      </div>

      <Card>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Book Cover */}
          <div style={{ flex: '0 0 250px' }}>
            <Image
              src={book.imageLinks?.thumbnail || book.imageLinks?.smallThumbnail}
              fallback="https://via.placeholder.com/250x350?text=No+Image"
              style={{ width: '100%', maxWidth: '250px' }}
              preview={true}
            />
          </div>

          {/* Book Information */}
          <div style={{ flex: '1', minWidth: '300px' }}>
            <Title level={2}>{book.title}</Title>
            
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div>
                <Text strong><UserOutlined /> Authors: </Text>
                <Text>{book.authorsText}</Text>
              </div>

              {book.publisher && (
                <div>
                  <Text strong>Publisher: </Text>
                  <Text>{book.publisher}</Text>
                </div>
              )}

              {book.publishedDate && (
                <div>
                  <Text strong><CalendarOutlined /> Published: </Text>
                  <Text>{book.publishedDate}</Text>
                </div>
              )}

              {book.pageCount && (
                <div>
                  <Text strong><BookOutlined /> Pages: </Text>
                  <Text>{book.pageCount}</Text>
                </div>
              )}

              <div>
                <Text strong>Language: </Text>
                <Text>{book.language?.toUpperCase()}</Text>
              </div>

              {/* Categories */}
              <div>
                <Text strong>Categories: </Text>
                <div style={{ marginTop: '8px' }}>
                  {book.categories?.map((category, index) => (
                    <Tag key={index} color="blue">{category}</Tag>
                  ))}
                </div>
              </div>
            </Space>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <>
            <Divider />
            <div>
              <Title level={3}>Description</Title>
              <div style={{ fontSize: '16px', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {book.description
                  .replace(/<br\s*\/?>/gi, '\n') // Convert br tags to newlines
                  .replace(/<[^>]*>/gi, '') // Remove all other HTML tags
                  .replace(/\n\s*\n/g, '\n\n') // Clean up multiple newlines
                  .trim() // Remove leading/trailing whitespace
                }
              </div>
            </div>
          </>
        )}

        <Divider/>
        <RatingReviewSection bookId={book.id} />
      </Card>
      
    </div>
  );
};

export default BookDetailsPage;