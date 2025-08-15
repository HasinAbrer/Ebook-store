import React, { useRef, useState } from 'react';
import { useSendMessageMutation, useGetMyMessagesQuery } from '../../redux/store';
import { useSelector } from 'react-redux';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { useGetMyProfileQuery } from '../../redux/features/profile/profileApi';
import avatarImg from '../../assets/avatar.png';

const ContactUs = () => {
  const { token, user } = useSelector((state) => state.auth);
  const { data: myProfile } = useGetMyProfileQuery(undefined, { skip: !token });
  const [sendMessage, { isLoading, isSuccess, isError, error }] = useSendMessageMutation();
  const { data: myMessagesData, refetch, isFetching } = useGetMyMessagesQuery(undefined, { skip: !token });
  const thread = myMessagesData?.messages?.[0] || null;
  const adminProfile = myMessagesData?.adminProfile || null;

  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileRef = useRef(null);

  const handlePickImage = () => fileRef.current?.click();

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file, token);
      setImageUrl(url);
    } catch (err) {
      alert(err?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content && !imageUrl) return;
    try {
      await sendMessage({ content, imageUrl }).unwrap();
      setContent('');
      setImageUrl('');
      refetch();
    } catch (_) {}
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left: thread overview (single thread) */}
        <div className="md:col-span-1 bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Your Conversation</h2>
          {isFetching ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : thread ? (
            <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
              <img src={myProfile?.photoUrl || avatarImg} className="w-10 h-10 rounded-full object-cover border" alt="you" />
              <div>
                <div className="text-sm font-medium">You</div>
                <div className="text-xs text-gray-500">{new Date(thread.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No messages yet. Start a conversation →</p>
          )}
        </div>

        {/* Right: messages panel */}
        <div className="md:col-span-2 bg-white rounded-lg shadow p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            {!thread ? (
              <p className="text-gray-600">Say hi to the admin to start your support chat.</p>
            ) : (
              <div className="space-y-4">
                {/* Initial message by you */}
                <div className="flex items-start gap-3 flex-row-reverse">
                  <img src={myProfile?.photoUrl || avatarImg} className="w-8 h-8 rounded-full object-cover border" alt="you" />
                  <div className="text-right">
                    <div className="text-sm font-semibold">You</div>
                    {thread.imageUrl && (
                      <img src={thread.imageUrl} alt="attachment" className="max-w-xs rounded mb-1 ml-auto" />
                    )}
                    {thread.content && (
                      <div className="bg-blue-100 rounded p-2 text-sm max-w-prose whitespace-pre-wrap inline-block">{thread.content}</div>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {thread.replies?.map((r, idx) => (
                  r.senderRole === 'admin' ? (
                    <div key={idx} className="flex items-start gap-3">
                      <img src={adminProfile?.photoUrl || avatarImg} className="w-8 h-8 rounded-full object-cover border" alt="admin" />
                      <div>
                        <div className="text-sm font-semibold">{adminProfile?.displayName || 'Admin'}</div>
                        {r.imageUrl && <img src={r.imageUrl} alt="attachment" className="max-w-xs rounded mb-1" />}
                        {r.content && (
                          <div className="bg-gray-100 rounded p-2 text-sm max-w-prose whitespace-pre-wrap">{r.content}</div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="flex items-start gap-3 flex-row-reverse">
                      <img src={myProfile?.photoUrl || avatarImg} className="w-8 h-8 rounded-full object-cover border" alt="you" />
                      <div className="text-right">
                        <div className="text-sm font-semibold">You</div>
                        {r.imageUrl && <img src={r.imageUrl} alt="attachment" className="max-w-xs rounded mb-1 ml-auto" />}
                        {r.content && (
                          <div className="bg-blue-100 rounded p-2 text-sm max-w-prose whitespace-pre-wrap inline-block">{r.content}</div>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </div>

          {/* Composer */}
          <form onSubmit={handleSend} className="mt-4 border-t pt-3">
            {isError && (
              <p className="text-red-500 mb-2 text-sm">{error?.data?.message || 'Failed to send message'}</p>
            )}
            <div className="flex items-center gap-2">
              <button type="button" onClick={handlePickImage} className="px-3 py-2 border rounded text-sm" disabled={uploading}>
                {uploading ? 'Uploading…' : '+ Image'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Write a message..."
              />
              <button type="submit" disabled={isLoading || uploading || (!content && !imageUrl)} className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300">
                {isLoading ? 'Sending...' : 'Send'}
              </button>
            </div>
            {imageUrl && (
              <div className="mt-2 flex items-center gap-2 text-xs text-gray-600">
                <img src={imageUrl} alt="preview" className="h-10 rounded" />
                <button type="button" className="underline" onClick={() => setImageUrl('')}>Remove</button>
              </div>
            )}
            {isSuccess && <p className="text-green-600 text-sm mt-2">Sent</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
