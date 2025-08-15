import React from 'react';
import { useSelector } from 'react-redux';
import { useGetAllReviewsQuery, useDeleteReviewMutation, useToggleFeatureReviewMutation } from '../../../redux/store';
import Loading from '../../../components/Loading';
import { FaTrash, FaStar } from 'react-icons/fa';

const ManageReviews = () => {
  const { token } = useSelector((state) => state.auth);
  const { data, isLoading, isError, error, refetch } = useGetAllReviewsQuery(undefined, {
    skip: !token,
  });
  const reviews = data?.reviews || [];
  const [deleteReview, { isLoading: isDeleting }] = useDeleteReviewMutation();
  const [toggleFeatureReview, { isLoading: isToggling }] = useToggleFeatureReviewMutation();

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      await deleteReview(id);
    }
  };

  const handleToggleFeature = async (id) => {
    await toggleFeatureReview(id);
  };

  if (isLoading) return <Loading />;
  if (isError) return <div className="text-red-500 text-center">Error: {error.data?.message || 'Failed to load reviews'}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Reviews</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Book</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Comment</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews?.map((review) => (
                <tr key={review._id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.userId?.name || 'Unknown User'}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.bookId?.title || 'Unknown Book'}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <div className="flex items-center">
                      {Array.from({ length: review.rating }, (_, i) => (
                        <FaStar key={i} className="text-yellow-500" />
                      ))}
                      {Array.from({ length: 5 - review.rating }, (_, i) => (
                        <FaStar key={i} className="text-gray-300" />
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm max-w-xs truncate">{review.comment}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {review.isFeatured && <span className="text-green-600 font-semibold">Featured</span>}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm flex items-center space-x-4">
                    <button
                      onClick={() => handleToggleFeature(review._id)}
                      disabled={isToggling}
                      className="text-gray-600 hover:text-yellow-500 disabled:opacity-50"
                      title={review.isFeatured ? 'Unfeature' : 'Feature'}
                    >
                      <FaStar className={review.isFeatured ? 'text-yellow-500' : 'text-gray-400'} />
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      disabled={isDeleting}
                      className="text-red-600 hover:text-red-900 disabled:opacity-50"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageReviews;
