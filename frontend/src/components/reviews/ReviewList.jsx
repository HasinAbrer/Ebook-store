import React from 'react';
import { useGetReviewsByBookQuery } from '../../redux/store';
import Loading from '../Loading';
import { FaStar, FaUserCircle } from 'react-icons/fa';

const ReviewList = ({ bookId }) => {
  const { data: reviews, isLoading, isError, error } = useGetReviewsByBookQuery(bookId);

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-500">Error fetching reviews.</div>;

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Customer Reviews</h3>
      {reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 shadow rounded-lg flex items-start space-x-4">
              <FaUserCircle className="h-10 w-10 text-gray-400" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{review.userId?.name || 'Anonymous'}</p>
                  <span className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center my-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <FaStar
                      key={index}
                      className={index < review.rating ? 'text-yellow-500' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <p className="text-gray-700">{review.comment}</p>
                {review.isFeatured && (
                  <div className="mt-2 text-sm font-semibold text-green-600">Featured Review</div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet. Be the first to write one!</p>
      )}
    </div>
  );
};

export default ReviewList;
