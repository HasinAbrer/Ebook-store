import React, { useState } from 'react'
import InputField from '../AddBook/InputField'
import SelectField from '../AddBook/SelectField'
import { useForm } from 'react-hook-form';
import { useAddBookMutation } from '../../../redux/features/books/booksApi';
import Swal from 'sweetalert2';
import axios from 'axios';
import getBaseUrl from '../../../utils/baseURL';

const AddBook = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [addBook, {isLoading}] = useAddBookMutation();
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [uploading, setUploading] = useState(false);

    const uploadCoverToCloudinary = async (file) => {
      // get signed params from backend
      const signUrl = `${getBaseUrl()}/api/uploads/sign`;
      const { data: sign } = await axios.post(signUrl, { folder: 'ebook-store/books' }, { withCredentials: true });
      const form = new FormData();
      form.append('file', file);
      form.append('folder', sign.folder);
      form.append('timestamp', sign.timestamp);
      form.append('api_key', sign.apiKey);
      form.append('signature', sign.signature);
      const uploadEndpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`;
      const { data: up } = await axios.post(uploadEndpoint, form);
      return up.secure_url;
    };

    const onSubmit = async (formData) => {
      try {
        setUploading(true);
        let coverUrl = '';
        if (!imageFile) {
          Swal.fire({ icon: 'error', title: 'Cover image required', text: 'Please select a cover image.' });
          setUploading(false);
          return;
        }
        // upload cover
        coverUrl = await uploadCoverToCloudinary(imageFile);

        const payload = {
          title: formData.title?.trim(),
          description: formData.description?.trim(),
          category: formData.category,
          trending: !!formData.trending,
          coverImage: coverUrl,
          oldPrice: Number(formData.oldPrice),
          newPrice: Number(formData.newPrice),
          stock: formData.stock ? Number(formData.stock) : 0,
        };

        await addBook(payload).unwrap();
        Swal.fire({
          title: 'Book added',
          text: 'Your book is uploaded successfully!',
          icon: 'success',
          confirmButtonColor: '#3085d6',
        });
        reset();
        setImageFile(null);
        setPreviewUrl('');
      } catch (error) {
        console.error(error);
        Swal.fire({ icon: 'error', title: 'Failed', text: 'Failed to add book. Please try again.' });
      } finally {
        setUploading(false);
      }
    };

    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = () => setPreviewUrl(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImageFile(null);
        setPreviewUrl('');
      }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Book</h2>

      {/* Form starts here */}
      <form onSubmit={handleSubmit(onSubmit)} className=''>
        {/* Reusable Input Field for Title */}
        <InputField
          label="Title"
          name="title"
          placeholder="Enter book title"
          register={register}
        />
        {errors?.title && <p className="text-red-500 text-sm mb-2">Title is required</p>}

        {/* Reusable Textarea for Description */}
        <InputField
          label="Description"
          name="description"
          placeholder="Enter book description"
          type="textarea"
          register={register}
        />
        {errors?.description && <p className="text-red-500 text-sm mb-2">Description is required</p>}

        {/* Reusable Select Field for Category */}
        <SelectField
          label="Category"
          name="category"
          options={[
            { value: '', label: 'Choose A Category' },
            { value: 'business', label: 'Business' },
            { value: 'technology', label: 'Technology' },
            { value: 'fiction', label: 'Fiction' },
            { value: 'horror', label: 'Horror' },
            { value: 'adventure', label: 'Adventure' },
            // Add more options as needed
          ]}
          register={register}
        />
        {errors?.category && <p className="text-red-500 text-sm mb-2">Category is required</p>}

        {/* Trending Checkbox */}
        <div className="mb-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              {...register('trending')}
              className="rounded text-blue-600 focus:ring focus:ring-offset-2 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-semibold text-gray-700">Trending</span>
          </label>
        </div>

        {/* Old Price */}
        <InputField
          label="Old Price"
          name="oldPrice"
          type="number"
          placeholder="Old Price"
          register={register}
        />

        {/* New Price */}
        <InputField
          label="New Price"
          name="newPrice"
          type="number"
          placeholder="New Price"
          register={register}
        />
        <InputField
          label="Stock"
          name="stock"
          type="number"
          placeholder="Stock (optional)"
          register={register}
        />

        {/* Cover Image Upload */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-2 w-full" />
          {previewUrl && (
            <div className="mt-2">
              <img src={previewUrl} alt="preview" className="h-32 rounded border" />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full py-2 bg-green-500 text-white font-bold rounded-md disabled:opacity-60" disabled={isLoading || uploading}>
         { (isLoading || uploading) ? <span>Uploading...</span> : <span>Add Book</span> }
        </button>
      </form>
    </div>
  )
}

export default AddBook