export async function getUploadSignature(token) {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/api/uploads/sign`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ folder: 'ebook-store/messages' }),
  });
  if (!res.ok) {
    let msg = 'Failed to get upload signature';
    try {
      const data = await res.json();
      if (data?.message) msg = data.message;
    } catch (_) {
      // ignore json parse errors
    }
    throw new Error(msg);
  }
  return res.json();
}

export async function uploadToCloudinary(file, token) {
  if (!file) throw new Error('No file provided');
  const { cloudName, apiKey, timestamp, signature, folder } = await getUploadSignature(token);

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', apiKey);
  form.append('timestamp', timestamp);
  form.append('signature', signature);
  form.append('folder', folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Cloudinary upload failed');
  const data = await res.json();
  return data.secure_url || data.url;
}
