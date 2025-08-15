import { configureStore } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import cartReducer from './features/cart/cartSlice';
import authReducer from './features/auth/authSlice';
import booksApi from './features/books/booksApi';
import ordersApi from './features/orders/ordersApi';
import profileApi from './features/profile/profileApi';
import usersApi from './features/users/usersApi';
import statsApi from './features/stats/statsApi';

// Define reviewsApi
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

// Define messagesApi
const messagesApi = createApi({
  reducerPath: 'messagesApi',
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
  tagTypes: ['Message'],
  endpoints: (builder) => ({
    getMessages: builder.query({
      query: () => '/api/messages/admin',
      providesTags: ['Message'],
    }),
    replyToMessage: builder.mutation({
      // Backend expects POST /api/messages/:id/reply { content, imageUrl? }
      query: ({ id, reply, imageUrl }) => ({
        url: `/api/messages/${id}/reply`,
        method: 'POST',
        body: { content: reply, imageUrl },
      }),
      invalidatesTags: ['Message'],
    }),
    closeMessage: builder.mutation({
      query: (id) => ({
        url: `/api/messages/${id}/close`,
        method: 'POST',
      }),
      invalidatesTags: ['Message'],
    }),
    purgeMessages: builder.mutation({
      query: () => ({
        url: '/api/messages/admin/purge',
        method: 'DELETE',
      }),
      invalidatesTags: ['Message'],
    }),
    sendMessage: builder.mutation({
      // Authenticated POST /api/messages/auth { content, imageUrl? }
      query: (newMessage) => ({
        url: '/api/messages/auth',
        method: 'POST',
        body: newMessage,
      }),
      invalidatesTags: ['Message'],
    }),
    getMyMessages: builder.query({
      query: () => '/api/messages/my',
      providesTags: ['Message'],
    }),
  }),
});

// Configure the store
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    [booksApi.reducerPath]: booksApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [statsApi.reducerPath]: statsApi.reducer,
    [reviewsApi.reducerPath]: reviewsApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      booksApi.middleware,
      ordersApi.middleware,
      profileApi.middleware,
      usersApi.middleware,
      statsApi.middleware,
      reviewsApi.middleware,
      messagesApi.middleware
    ),
});

// Export hooks from both APIs AFTER the store is configured
export const { useGetAllReviewsQuery, useGetReviewsByBookQuery, useAddReviewMutation, useDeleteReviewMutation, useToggleFeatureReviewMutation } = reviewsApi;
export const { useGetMessagesQuery, useReplyToMessageMutation, useCloseMessageMutation, usePurgeMessagesMutation, useSendMessageMutation, useGetMyMessagesQuery } = messagesApi;