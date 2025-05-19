
import React, { useState, useEffect } from 'react';
import { Card, Rate, Input, Button, Space, Typography, message } from 'antd';
import { EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { addReview, updateReview, removeReview, selectReviewByBookId } from '../../store/reviewSlice';

const { TextArea } = Input;
const { Title, Text } = Typography;


interface RatingReviewSectionProps {
    bookId: string;
}


const RatingReviewSection: React.FC<RatingReviewSectionProps> = ({ bookId }) => {
    const dispatch = useAppDispatch();
    const existingReview = useAppSelector(state => selectReviewByBookId(state, bookId));
    
    // Get auth info from your existing auth slice
    const { user } = useAppSelector(state => state.auth);
    const currentUsername = user?.username;

    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
  
    // Load existing review data when component mounts or when existingReview changes
    useEffect(() => {
      if (existingReview) {
        setRating(existingReview.rating);
        setReviewText(existingReview.review);
      } else {
        setRating(0);
        setReviewText('');
      }
    }, [existingReview]);
  
    const handleSubmit = async () => {
      if (rating === 0) {
        message.error('Please provide a rating before submitting');
        return;
      }

      if (reviewText.trim().length === 0) {
        message.error('Please write a review before submitting');
        return;
      }
      
      setIsSubmitting(true);
  
      try {
        if (existingReview) {
          // Update existing review
          dispatch(updateReview({
            id: existingReview.id,
            rating,
            review: reviewText.trim(),
          }));
          message.success('Review updated successfully!');
        } else {
          // Add new review
          dispatch(addReview({
            bookId,
            rating,
            review: reviewText.trim(),
            username: currentUsername || "",
          }));
          message.success('Review submitted successfully!');
        }
        setIsEditing(false);
      } catch (error) {
        message.error('Failed to submit review. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };
  
    const handleEdit = () => {
      setIsEditing(true);
    };
  
    const handleCancel = () => {
      if (existingReview) {
        setRating(existingReview.rating);
        setReviewText(existingReview.review);
      } else {
        setRating(0);
        setReviewText('');
      }
      setIsEditing(false);
    };
  
    const handleDelete = () => {
      if (existingReview) {
        dispatch(removeReview(existingReview.id));
        message.success('Review deleted successfully!');
        setRating(0);
        setReviewText('');
        setIsEditing(false);
      }
    };
  
    const formatDate = (timestamp: number) => {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    };
  
    const isFormValid = rating > 0 && reviewText.trim().length > 0;
  
    return (
    <div style={{ width: '100%' }}>
        <Title level={3}>Ratings and Reviews</Title>
        
        <Card style={{ width: '100%' }}>
          {existingReview && !isEditing ? (
            // show existing review
            <div style={{ maxWidth: '100%' }}>
              <Space direction="vertical" style={{ width: '100%', display: 'flex'  }} size="large">
                
                {/* Display user info */}

                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <Text strong style={{ fontSize: '16px' }}>{existingReview.username}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    Reviewed on {formatDate(existingReview.timestamp)}
                  </Text>
                </div>
              </div>
                
                <div>
                  <Space>
                    <Text strong>Your Rating:</Text>
                    <Rate disabled value={existingReview.rating} />
                    <Text>({existingReview.rating}/5)</Text>
                  </Space>
                </div>
                
                <div>
                  <Text strong>Your Review:</Text>
                  <div style={{ 
                    marginTop: 8, 
                    padding: 12, 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: 6,
                    whiteSpace: 'pre-wrap' 
                  }}>
                    {existingReview.review}
                  </div>
                </div>
                <Space>
                  <Button 
                    type="primary" 
                    icon={<EditOutlined />} 
                    onClick={handleEdit}
                  >
                    Edit Review
                  </Button>
                  <Button 
                    danger 
                    icon={<DeleteOutlined />} 
                    onClick={handleDelete}
                  >
                    Delete Review
                  </Button>
                </Space>
              </Space>
            </div>
          ) : (
            // form for new review or editing
            <div style={{ maxWidth: '100%' }}>
              <Space direction="vertical" style={{ width: '100%', display:"flex" }} size="large">
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Rate this book:
                  </Text>
                  <Rate
                    value={rating}
                    onChange={setRating}
                    style={{ fontSize: 24 }}
                  />
                  {rating > 0 && (
                    <Text style={{ marginLeft: 12 }}>({rating}/5)</Text>
                  )}
                </div>
                
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Write your review:
                  </Text>
                  <TextArea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Share your thoughts about this book..."
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    maxLength={1000}
                    showCount
                  />
                </div>
                
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={handleSubmit}
                    loading={isSubmitting}
                    disabled={!isFormValid}
                  >
                    {existingReview ? 'Update Review' : 'Submit Review'}
                  </Button>
                  
                  {(existingReview || isEditing) && (
                    <Button
                      icon={<CloseOutlined />}
                      onClick={handleCancel}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  )}
                </Space>
                
                {!isFormValid && (rating > 0 || reviewText.length > 0) && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {rating === 0 && 'Please provide a rating. '}
                    {reviewText.trim().length === 0 && 'Please write a review.'}
                  </Text>
                )}
              </Space>
            </div>
          )}
        </Card>
      </div>
    );
  };
  
  export default RatingReviewSection;

