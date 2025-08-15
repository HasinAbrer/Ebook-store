import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { uploadToCloudinary } from '../../utils/cloudinary';
import { useGetMyMessagesQuery, useReplyToMessageMutation } from '../../redux/store';
import Loading from '../../components/Loading';

const MyMessages = () => {
  const { token } = useSelector((s) => s.auth);
  const { data, isLoading, isError, error, refetch } = useGetMyMessagesQuery();
  const [replyToMessage, { isLoading: isReplying }] = useReplyToMessageMutation();
  const threads = data?.messages || [];
  const [activeId, setActiveId] = useState(null);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);

  const activeThread = threads.find((t) => t._id === activeId) || threads[0];

  const onSend = async (e) => {
    e.preventDefault();
    if (!activeThread?._id) return;
    if (!text.trim() && !imageUrl.trim() && !file) return;
    let uploadedUrl = imageUrl || '';
    if (file) {
      uploadedUrl = await uploadToCloudinary(file, token);
    }
    await replyToMessage({ id: activeThread._id, reply: text, imageUrl: uploadedUrl || undefined }).unwrap();
    setText('');
    setImageUrl('');
    setFile(null);
    refetch();
  };

  if (isLoading) return <Loading/>;
  if (isError) return <div className="max-w-4xl mx-auto p-4 text-red-600">{error?.data?.message || 'Failed to load messages'}</div>;

  if (!threads.length) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-2">Messages</h1>
        <p className="text-gray-600">You have no conversations yet. Use the Contact Admin button to start one.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-white rounded-lg shadow p-3 md:col-span-1">
        <h2 className="font-semibold mb-2">Your Conversations</h2>
        <ul className="space-y-2">
          {threads.map((t) => (
            <li key={t._id}>
              <button
                onClick={() => setActiveId(t._id)}
                className={`w-full text-left p-2 rounded border ${activeThread?._id === t._id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
              >
                <p className="font-medium truncate">{t.subject}</p>
                <p className="text-xs text-gray-500">{new Date(t.createdAt).toLocaleString()}</p>
                <span className={`mt-1 inline-block text-xxs px-2 py-0.5 rounded ${t.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{t.status}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-lg shadow p-4 md:col-span-2 flex flex-col h-[70vh]">
        <div className="border-b pb-2 mb-3">
          <h2 className="text-xl font-bold">Admin</h2>
          <p className="text-xxs text-gray-500">Conversation started {new Date(activeThread?.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {/* initial message from user -> align right, blue */}
          <div className="p-2 rounded max-w-[80%] bg-blue-100 ml-auto">
            <p className="text-xs font-bold mb-0.5">You</p>
            <p className="text-sm text-gray-800">{activeThread?.content}</p>
            {activeThread?.imageUrl && (
              <div className="mt-1">
                <img src={activeThread.imageUrl} alt="attachment" className="max-h-48 rounded" />
              </div>
            )}
            <p className="text-xxs text-gray-500 text-right">{new Date(activeThread?.createdAt).toLocaleString()}</p>
          </div>
          {activeThread?.replies?.map((r, i) => (
            <div
              key={i}
              className={`p-2 rounded max-w-[80%] ${r.senderRole === 'admin' ? 'bg-gray-100' : 'bg-blue-100 ml-auto'}`}
            >
              <p className="text-xs mb-0.5 font-bold">{r.senderRole === 'admin' ? 'Admin' : 'You'}</p>
              {r.content && <p className="text-sm text-gray-800">{r.content}</p>}
              {r.imageUrl && (
                <div className="mt-1">
                  <img src={r.imageUrl} alt="attachment" className="max-h-48 rounded" />
                </div>
              )}
              <p className="text-xxs text-gray-500 text-right">{new Date(r.at).toLocaleString()}</p>
            </div>
          ))}
        </div>

        <form onSubmit={onSend} className="mt-3 space-y-2">
          <input
            className="w-full border rounded px-3 py-2"
            placeholder={activeThread?.status === 'closed' ? 'This ticket is closed' : 'Type your message...'}
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={activeThread?.status === 'closed' || isReplying}
          />
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Optional image URL (https://...)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            disabled={activeThread?.status === 'closed' || isReplying}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={activeThread?.status === 'closed' || isReplying}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300"
              disabled={activeThread?.status === 'closed' || isReplying || (!text.trim() && !imageUrl.trim() && !file)}
            >
              {isReplying ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyMessages;
