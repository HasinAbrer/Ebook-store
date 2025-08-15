import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// Note: auth headers come from Redux token in prepareHeaders

const messagesApi = createApi({
  reducerPath: 'messagesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: async (headers) => {
      // Always choose token by current path to prevent crossover via shared Redux auth
      const path = typeof window !== 'undefined' ? (window.location.pathname || '') : '';
      const token = path.startsWith('/dashboard')
        ? localStorage.getItem('admin_token')
        : localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
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
      // Admin or user reply; backend expects POST /api/messages/:id/reply { content, imageUrl? }
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
    sendMessage: builder.mutation({
      // Authenticated contact to admin
      query: (newMessage) => ({
        url: '/api/messages/auth',
        method: 'POST',
        body: newMessage, // { subject, content }
      }),
      invalidatesTags: ['Message'],
    }),
    // User: my messages
    getMyMessages: builder.query({
      query: () => '/api/messages/my',
      providesTags: ['Message'],
    }),
  }),
});

export const { useGetMessagesQuery, useReplyToMessageMutation, useCloseMessageMutation, useSendMessageMutation, useGetMyMessagesQuery } = messagesApi;
export default messagesApi;
