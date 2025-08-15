import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetMyProfileQuery, useUpsertMyProfileMutation } from '../../redux/features/profile/profileApi';
import { uploadToCloudinary } from '../../utils/cloudinary';

const Profile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const username = user?.username || '';

  const { data: profile, isFetching } = useGetMyProfileQuery(undefined, {
    skip: !username,
  });
  const [upsertProfile, { isLoading: isSaving }] = useUpsertMyProfileMutation();

  const [form, setForm] = useState({
    displayName: '',
    photoUrl: '',
    phone: '',
    address: {
      line1: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });
  const fileRef = useRef(null);

  useEffect(() => {
    if (profile) {
      setForm({
        displayName: profile.displayName || '',
        photoUrl: profile.photoUrl || '',
        phone: profile.phone || '',
        address: {
          line1: profile.address?.line1 || '',
          city: profile.address?.city || '',
          state: profile.address?.state || '',
          postalCode: profile.address?.postalCode || '',
          country: profile.address?.country || '',
        },
      });
    } else if (user) {
      setForm((f) => ({ ...f, displayName: user.displayName || '' }));
    }
  }, [profile, user]);

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm((prev) => ({ ...prev, address: { ...prev.address, [key]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!username) return;
    try {
      await upsertProfile(form).unwrap();
      alert('Profile saved');
    } catch (err) {
      console.error(err);
      alert('Failed to save profile');
    }
  };

  const avatar = useMemo(() => {
    return form.photoUrl || '';
  }, [form.photoUrl]);

  const onPickFile = () => fileRef.current?.click();

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !token) return;
    try {
      const url = await uploadToCloudinary(file, token);
      const next = { ...form, photoUrl: url };
      setForm(next);
      // Persist immediately so navbar updates across the app
      await upsertProfile(next).unwrap();
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload image');
    } finally {
      e.target.value = '';
    }
  };

  if (!username) {
    return <div className="max-w-screen-md mx-auto p-4">Please log in to view your profile.</div>;
  }

  return (
    <div className="max-w-screen-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200" />
          )}
          <button
            type="button"
            onClick={onPickFile}
            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-blue-600 text-white text-lg leading-7 text-center shadow"
            title="Add profile image"
          >
            +
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </div>
        <div>
          <p className="font-medium">{username}</p>
          <p className="text-sm text-gray-500">Update your personal information</p>
        </div>
      </div>

      {isFetching ? (
        <p>Loading profile...</p>
      ) : (
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input
              name="displayName"
              value={form.displayName}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="Your name"
            />
          </div>
          {/** Photo URL field removed; use + button to upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={onChange}
              className="w-full border rounded-md px-3 py-2"
              placeholder="+1 555 555 5555"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Address line 1</label>
              <input
                name="address.line1"
                value={form.address.line1}
                onChange={onChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                name="address.city"
                value={form.address.city}
                onChange={onChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">State</label>
              <input
                name="address.state"
                value={form.address.state}
                onChange={onChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Postal Code</label>
              <input
                name="address.postalCode"
                value={form.address.postalCode}
                onChange={onChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Country</label>
              <input
                name="address.country"
                value={form.address.country}
                onChange={onChange}
                className="w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary px-6 py-2 rounded-md"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Profile;
