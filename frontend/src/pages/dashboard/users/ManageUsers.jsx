import React, { useState } from 'react';
import { useGetUsersQuery } from '../../../redux/features/users/usersApi';
import { useGetMessagesQuery, useGetAllReviewsQuery } from '../../../redux/store';
import Loading from '../../../components/Loading';
import { FaEnvelope, FaStar, FaEye, FaEyeSlash, FaComments, FaBookOpen } from 'react-icons/fa';

const ManageUsers = () => {
  const { data: usersData, isLoading: usersLoading, isError: usersError, error: usersErrorMsg } = useGetUsersQuery();
  const { data: messagesData } = useGetMessagesQuery();
  const { data: reviewsData } = useGetAllReviewsQuery();
  
  const [expandedUser, setExpandedUser] = useState(null);

  if (usersLoading) {
    return <Loading />;
  }

  if (usersError) {
    return <div className="text-red-500 text-center">Error: {usersErrorMsg?.data?.message || 'Failed to fetch users'}</div>;
  }

  const { users } = usersData || {};
  const messages = messagesData?.messages || [];
  const reviews = reviewsData?.reviews || [];

  // Helper function to get user messages
  const getUserMessages = (userId) => {
    return messages.filter(msg => msg.userId === userId || msg.userId?._id === userId);
  };

  // Helper function to get user reviews
  const getUserReviews = (userId) => {
    return reviews.filter(review => review.userId === userId || review.userId?._id === userId);
  };

  const toggleUserExpansion = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div className="p-4 lg:p-8">
      <h2 className="text-2xl font-bold mb-6">Manage Users</h2>
      <div className="space-y-4">
        {users && users.length > 0 ? (
          users.map((user) => {
            const userMessages = getUserMessages(user._id);
            const userReviews = getUserReviews(user._id);
            const isExpanded = expandedUser === user._id;

            return (
              <div key={user._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* User Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-gray-700">
                            {user.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{user.username}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                          <span className="text-sm text-gray-500">
                            Joined: {new Date(user.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {/* Activity Stats */}
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FaEnvelope className="h-4 w-4" />
                          <span>{userMessages.length} messages</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FaStar className="h-4 w-4" />
                          <span>{userReviews.length} reviews</span>
                        </div>
                      </div>
                      
                      {/* Expand/Collapse Button */}
                      <button
                        onClick={() => toggleUserExpansion(user._id)}
                        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        {isExpanded ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                        <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Messages Section */}
                      <div>
                        <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                          <FaComments className="h-5 w-5 mr-2 text-blue-500" />
                          Messages ({userMessages.length})
                        </h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {userMessages.length > 0 ? (
                            userMessages.map((message) => (
                              <div key={message._id} className="bg-white p-3 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-900">{message.subject}</h5>
                                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    message.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {message.status}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{message.content}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{new Date(message.createdAt).toLocaleDateString()}</span>
                                  {message.replies && message.replies.length > 0 && (
                                    <span>{message.replies.length} replies</span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No messages from this user.</p>
                          )}
                        </div>
                      </div>

                      {/* Reviews Section */}
                      <div>
                        <h4 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                          <FaBookOpen className="h-5 w-5 mr-2 text-yellow-500" />
                          Reviews ({userReviews.length})
                        </h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {userReviews.length > 0 ? (
                            userReviews.map((review) => (
                              <div key={review._id} className="bg-white p-3 rounded-lg border">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium text-gray-900">
                                    {review.bookId?.title || 'Unknown Book'}
                                  </h5>
                                  <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                      <FaStar
                                        key={index}
                                        className={`h-4 w-4 ${
                                          index < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{review.comment}</p>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                  <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                  {review.isFeatured && (
                                    <span className="text-green-600 font-semibold">Featured</span>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-gray-500 text-sm">No reviews from this user.</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
