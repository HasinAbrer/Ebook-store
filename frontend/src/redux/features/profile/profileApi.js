import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import getBaseUrl from '../../../utils/baseURL';

const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${getBaseUrl()}/api/profile`,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Always choose token by path to avoid cross-over via shared Redux token
      const path = typeof window !== 'undefined' ? window.location.pathname : '';
      let token = null;
      if (path.startsWith('/dashboard')) {
        token = localStorage.getItem('admin_token');
      } else {
        token = localStorage.getItem('token');
      }
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Profile'],
  endpoints: (builder) => ({
    // Token-based
    getMyProfile: builder.query({
      query: () => `/me`,
      providesTags: ['Profile'],
      // Separate cache keys for admin vs user to avoid cross-session cache reuse
      serializeQueryArgs: ({ endpointName }) => {
        const path = typeof window !== 'undefined' ? window.location.pathname : '';
        const scope = path.startsWith('/dashboard') ? 'admin' : 'user';
        const token = scope === 'admin' ? localStorage.getItem('admin_token') : localStorage.getItem('token');
        return `${endpointName}:${scope}:${token || 'none'}`;
      },
      // Always refetch on mount/arg change; also force when cache args (token/scope) differ
      refetchOnMountOrArgChange: true,
      keepUnusedDataFor: 0,
    }),
    upsertMyProfile: builder.mutation({
      query: (body) => ({
        url: `/me`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
    // Legacy (kept in case something still calls by email)
    getProfileByEmail: builder.query({
      query: (email) => `/${encodeURIComponent(email)}`,
      providesTags: ['Profile'],
    }),
    upsertProfile: builder.mutation({
      query: ({ email, body }) => ({
        url: `/${encodeURIComponent(email)}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Profile'],
    }),
  }),
});

export const { useGetMyProfileQuery, useUpsertMyProfileMutation, useGetProfileByEmailQuery, useUpsertProfileMutation } = profileApi;
export default profileApi;
