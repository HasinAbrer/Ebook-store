import React, { useEffect, useState } from 'react';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { useSelector } from 'react-redux';
import { useGetMessagesQuery, useReplyToMessageMutation } from '../../../redux/store';
import Loading from '../../../components/Loading';
import { useGetMyProfileQuery } from '../../../redux/features/profile/profileApi';

const ManageMessages = () => {
  const { token } = useSelector((s) => s.auth);
  const { data, isLoading, isError, error, refetch } = useGetMessagesQuery(undefined, { skip: !token });
  const messages = data?.messages || [];
  const [replyToMessage, { isLoading: isReplying }] = useReplyToMessageMutation();
  const [selectedId, setSelectedId] = useState(null);
  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [file, setFile] = useState(null);
  const [sendError, setSendError] = useState('');
  const [sendSuccess, setSendSuccess] = useState('');
  const { data: adminProfile } = useGetMyProfileQuery(undefined, { skip: !token });

  const selected = messages.find((m) => m._id === selectedId) || messages[0];
  const userProfile = selected?.userProfile || null;

  useEffect(() => {
    if (!selectedId && messages.length > 0) {
      setSelectedId(messages[0]._id);
    }
  }, [messages, selectedId]);

  const onSend = async (e) => {
    e.preventDefault();
    setSendError('');
    setSendSuccess('');
    if (!selected?._id) return;
    if (!text.trim() && !imageUrl && !file) {
      setSendError('Type a reply or attach an image.');
      return;
    }
    try {
      let url = (imageUrl || '').trim();
      if (file) {
        url = await uploadToCloudinary(file, token);
      }
      await replyToMessage({ id: selected._id, reply: text.trim(), imageUrl: url || undefined }).unwrap();
      setText('');
      setImageUrl('');
      setFile(null);
      setSendSuccess('Reply sent');
      setTimeout(() => setSendSuccess(''), 1500);
      refetch();
    } catch (err) {
      const msg = err?.data?.message || err?.message || 'Failed to send reply';
      setSendError(msg);
    }
  };

  // Purge UI removed per request

  // Close option removed per request

  if (isLoading) return <Loading/>;
  if (isError) return <div className="text-red-500 text-center">Error: {error?.data?.message || 'Failed to load messages'}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Messages</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded shadow p-3 md:col-span-1 max-h-[75vh] overflow-y-auto">
          <h2 className="font-semibold mb-2">Conversations</h2>
          <ul className="space-y-2">
            {messages.length === 0 && (
              <li className="text-sm text-gray-500">No conversations found.</li>
            )}
            {messages.map((m) => (
              <li key={m._id}>
                <button
                  onClick={() => setSelectedId(m._id)}
                  className={`w-full text-left p-2 rounded border ${selected?._id === m._id ? 'bg-blue-50 border-blue-300' : 'bg-gray-50 border-gray-200'}`}
                >
                  <div className="flex items-center gap-2">
                    <img src={m.userProfile?.photoUrl || '/default-avatar.png'} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                    <p className="font-medium truncate">{m.userProfile?.displayName || m.userId?.username || m.userId?.email || 'Unknown User'}</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{m.subject}</p>
                  <span className={`mt-1 inline-block text-xxs px-2 py-0.5 rounded ${m.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{m.status}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded shadow p-4 md:col-span-2 flex flex-col h-[75vh]">
          {!selected ? (
            <div className="text-gray-500">Select a conversation</div>
          ) : (
            <>
              <div className="flex justify-between items-start border-b pb-2 mb-3">
                <div>
                  <h2 className="text-xl font-bold">{userProfile?.displayName || selected.userId?.username || selected.userId?.email || 'Unknown User'}</h2>
                  <p className="text-sm text-gray-600">{selected.subject}</p>
                  <p className="text-xxs text-gray-500">Opened {new Date(selected.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {/** Original user message */}
                <div className="flex items-start gap-2">
                  <img src={userProfile?.photoUrl || '/default-avatar.png'} alt="user avatar" className="w-8 h-8 rounded-full object-cover mt-0.5" />
                  <div className="p-2 rounded bg-gray-100 max-w-[80%]">
                    <p className="text-xs font-semibold mb-0.5">{userProfile?.displayName || selected.userId?.username || selected.userId?.email || 'Unknown User'}</p>
                    <p className="text-sm text-gray-800">{selected.content}</p>
                    {selected.imageUrl && (
                      <div className="mt-1"><img src={selected.imageUrl} alt="attachment" className="max-h-48 rounded"/></div>
                    )}
                    <p className="text-xxs text-gray-500 text-right">{new Date(selected.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {/** Replies */}
                {selected.replies?.map((r, i) => {
                  const userLabel = r.senderRole === 'admin' ? 'Admin' : (selected.userId?.username || selected.userId?.email || 'Unknown User');
                  return (
                    <div key={i} className={`flex items-start gap-2 ${r.senderRole === 'admin' ? 'flex-row-reverse' : 'flex-row' }`}>
                      <img src={(r.senderRole === 'admin' ? (adminProfile?.photoUrl || '/default-avatar.png') : (userProfile?.photoUrl || '/default-avatar.png'))} alt="avatar" className="w-7 h-7 rounded-full object-cover mt-0.5" />
                      <div className={`p-2 rounded max-w-[80%] ${r.senderRole === 'admin' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <p className="text-xs font-semibold mb-0.5">{r.senderRole === 'admin' ? 'Admin' : (userProfile?.displayName || selected.userId?.username || selected.userId?.email || 'Unknown User')}</p>
                        {r.content && <p className="text-sm text-gray-800">{r.content}</p>}
                        {r.imageUrl && (<div className="mt-1"><img src={r.imageUrl} alt="attachment" className="max-h-48 rounded"/></div>)}
                        <p className="text-xxs text-gray-500 text-right">{new Date(r.at).toLocaleString()}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
              <form onSubmit={onSend} className="mt-3 space-y-2">
                <textarea
                  className="w-full border rounded px-3 py-2"
                  rows={3}
                  placeholder={selected.status === 'closed' ? 'This ticket is closed' : 'Type your reply...'}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={selected.status === 'closed' || isReplying}
                />
                <input
                  className="w-full border rounded px-3 py-2"
                  placeholder="Optional image URL (https://...)"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={selected.status === 'closed' || isReplying}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={selected.status === 'closed' || isReplying}
                />
                {sendError && <div className="text-sm text-red-600">{sendError}</div>}
                {sendSuccess && <div className="text-sm text-green-600">{sendSuccess}</div>}
                <div className="flex justify-end">
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300" disabled={selected.status === 'closed' || isReplying || (!text.trim() && !imageUrl && !file)}>
                    {isReplying ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageMessages;
