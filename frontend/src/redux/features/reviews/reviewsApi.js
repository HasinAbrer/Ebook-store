import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { auth } from '../../../firebase/firebase.config';

const reviewsApi = createApi({
  reducerPath: 'reviewsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: async (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Review'],
  endpoints: (builder) => ({
    getAllReviews: builder.query({
      query: () => '/api/reviews/admin',
      providesTags: ['Review'],
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/api/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),
    toggleFeatureReview: builder.mutation({
      query: (id) => ({
        url: `/api/reviews/admin/feature/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Review'],
    }),
    getReviewsByBook: builder.query({
      query: (bookId) => `/api/reviews/book/${bookId}`,
      providesTags: (result, error, bookId) => [{ type: 'Review', id: bookId }],
    }),
    addReview: builder.mutation({
      query: (newReview) => ({
        url: '/api/reviews',
        method: 'POST',
        body: newReview,
      }),
      invalidatesTags: ['Review'],
    }),
  }),
});

export const { useGetAllReviewsQuery, useGetReviewsByBookQuery, useAddReviewMutation, useDeleteReviewMutation, useToggleFeatureReviewMutation } = reviewsApi;
export default reviewsApi;
