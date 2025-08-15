import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetMyProfileQuery, useUpsertMyProfileMutation } from '../../redux/features/profile/profileApi';
import { uploadToCloudinary } from '../../utils/cloudinary';
import avatarImg from '../../assets/avatar.png';

const Settings = () => {
  // Always use admin_token on dashboard to avoid using a user token by mistake
  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
  const { data: profile, refetch, isFetching } = useGetMyProfileQuery(undefined, { skip: !adminToken });
  const [saveProfile, { isLoading, isError, error, isSuccess }] = useUpsertMyProfileMutation();
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [photoUrl, setPhotoUrl] = useState(profile?.photoUrl || '');
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  React.useEffect(() => {
    setDisplayName(profile?.displayName || '');
    setPhotoUrl(profile?.photoUrl || '');
  }, [profile]);

  const onPick = () => fileRef.current?.click();
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadToCloudinary(file, adminToken);
      setPhotoUrl(url);
    } catch (err) {
      alert(err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      await saveProfile({ displayName, photoUrl }).unwrap();
      refetch();
    } catch (_) {}
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
      <div className="bg-white p-6 shadow rounded-lg max-w-xl">
        <form onSubmit={onSave} className="space-y-4">
          <div className="flex items-center gap-4">
            <img src={photoUrl || avatarImg} alt="avatar" className="w-16 h-16 rounded-full object-cover border" />
            <div className="space-x-2">
              <button type="button" onClick={onPick} className="px-3 py-2 border rounded text-sm" disabled={uploading}>
                {uploading ? 'Uploading…' : 'Upload Photo'}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
              {photoUrl && (
                <button type="button" onClick={() => setPhotoUrl('')} className="px-3 py-2 border rounded text-sm">Remove</button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Display Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g., Admin John"
            />
          </div>
          {isError && <div className="text-sm text-red-600">{error?.data?.message || 'Failed to save profile'}</div>}
          {isSuccess && <div className="text-sm text-green-600">Saved</div>}
          <div className="flex justify-end">
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-blue-300" disabled={isLoading || uploading}>
              {isLoading ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
