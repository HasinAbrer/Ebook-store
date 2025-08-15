import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { auth } from '../../../firebase/firebase.config';


const statsApi = createApi({
  reducerPath: 'statsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: async (headers) => {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Stats'],
  endpoints: (builder) => ({
    getStats: builder.query({
      query: () => '/api/admin',
      providesTags: ['Stats'],
    }),
  }),
});

export const { useGetStatsQuery } = statsApi;
export default statsApi;
