import React, { useState, useRef } from 'react';
import { useGetMessagesQuery, useReplyToMessageMutation } from '../redux/store';
import { useSelector } from 'react-redux';
import { FaComments, FaTimes, FaPaperPlane, FaImage, FaUser } from 'react-icons/fa';

const AdminChatSidebar = () => {
  const { token } = useSelector((state) => state.auth);
  const { data, refetch } = useGetMessagesQuery(undefined, { skip: !token });
  const [replyToMessage] = useReplyToMessageMutation();
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);

  const messages = data?.messages || [];
  
  // Group messages by user
  const messagesByUser = messages.reduce((acc, message) => {
    const userId = message.userId?._id || message.userId;
    const userName = message.userId?.name || message.userId?.username || 'Unknown User';
    
    if (!acc[userId]) {
      acc[userId] = {
        userId,
        userName,
        messages: []
      };
    }
    acc[userId].messages.push(message);
    return acc;
  }, {});

  const handleUserSelect = (userId) => {
    setSelectedUser(userId);
    setReplyText('');
    setSelectedImage(null);
  };

  const handleSendReply = async (messageId) => {
    if (!replyText.trim() && !selectedImage) return;

    try {
      let content = replyText;
      if (selectedImage) {
        // For now, just include image name in the message
        // In a real app, you'd upload the image first
        content += selectedImage ? ` [Image: ${selectedImage.name}]` : '';
      }

      await replyToMessage({ 
        id: messageId, 
        reply: content 
      }).unwrap();
      
      setReplyText('');
      setSelectedImage(null);
      refetch();
    } catch (error) {
      console.error('Failed to send reply:', error);
      alert('Failed to send reply');
    }
  };

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  if (!token) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors duration-200"
        >
          <FaComments className="h-6 w-6" />
        </button>
      </div>

      {/* Chat Sidebar */}
      {isOpen && (
        <div className="fixed left-0 top-0 h-full w-80 bg-white shadow-xl z-40 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">User Messages</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200"
            >
              <FaTimes className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 flex">
            {/* User List */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              {Object.values(messagesByUser).map((userGroup) => (
                <div
                  key={userGroup.userId}
                  onClick={() => handleUserSelect(userGroup.userId)}
                  className={`p-3 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedUser === userGroup.userId ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <FaUser className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {userGroup.userName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {userGroup.messages.length} message{userGroup.messages.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messagesByUser[selectedUser]?.messages.map((message) => (
                      <div key={message._id} className="space-y-2">
                        {/* Original Message */}
                        <div className="bg-gray-100 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900">
                              {message.subject}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(message.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{message.content}</p>
                        </div>

                        {/* Replies */}
                        {message.replies && message.replies.map((reply, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded-lg max-w-xs ${
                              reply.senderRole === 'admin'
                                ? 'bg-blue-500 text-white ml-auto'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{reply.content}</p>
                            <span className="text-xs opacity-75">
                              {new Date(reply.at).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}

                        {/* Reply Input */}
                        <div className="flex items-center space-x-2 mt-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type a reply..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleSendReply(message._id);
                              }
                            }}
                          />
                          
                          {/* Image Upload */}
                          <button
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 text-gray-500 hover:text-gray-700"
                            title="Upload image"
                          >
                            <FaImage className="h-4 w-4" />
                          </button>
                          
                          {/* Send Button */}
                          <button
                            onClick={() => handleSendReply(message._id)}
                            className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            disabled={!replyText.trim() && !selectedImage}
                          >
                            <FaPaperPlane className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Selected Image Preview */}
                        {selectedImage && (
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <FaImage className="h-4 w-4" />
                            <span>{selectedImage.name}</span>
                            <button
                              onClick={() => setSelectedImage(null)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>Select a user to view messages</p>
                </div>
              )}
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
        </div>
      )}
    </>
  );
};

export default AdminChatSidebar;
