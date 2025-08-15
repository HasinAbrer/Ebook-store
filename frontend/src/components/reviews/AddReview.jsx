import React, { useState } from 'react';
import { useAddReviewMutation } from '../../redux/store';
import { useAuth } from '../../context/AuthContext';
import { FaStar } from 'react-icons/fa';

const AddReview = ({ bookId }) => {
  const [addReview, { isLoading, isSuccess, isError, error }] = useAddReviewMutation();
  const { currentUser: user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0 || !comment.trim()) {
      alert('Please provide a rating and a comment.');
      return;
    }
    await addReview({ bookId, rating, comment });
    if (!isError) {
        setRating(0);
        setComment('');
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Write a Review</h3>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded-lg">
        <div className="mb-4">
          <label className="block text-gray-700 font-bold mb-2">Your Rating</label>
          <div className="flex items-center">
            {[...Array(5)].map((star, index) => {
              const ratingValue = index + 1;
              return (
                <label key={index}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setRating(ratingValue)}
                    className="hidden"
                  />
                  <FaStar
                    className="cursor-pointer"
                    color={ratingValue <= (hover || rating) ? '#ffc107' : '#e4e5e9'}
                    size={25}
                    onMouseEnter={() => setHover(ratingValue)}
                    onMouseLeave={() => setHover(0)}
                  />
                </label>
              );
            })}
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 font-bold mb-2">Your Comment</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-2 border rounded-md"
            rows="4"
            required
          ></textarea>
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300">
          {isLoading ? 'Submitting...' : 'Submit Review'}
        </button>
        {isSuccess && <p className="text-green-500 mt-4">Review submitted successfully!</p>}
        {isError && <p className="text-red-500 mt-4">Error: {error.data?.message || 'Failed to submit review'}</p>}
      </form>
    </div>
  );
};

export default AddReview;
