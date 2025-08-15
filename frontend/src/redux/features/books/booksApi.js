import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import getBaseUrl from '../../../utils/baseURL';
import { auth } from '../../../firebase/firebase.config';


const baseQuery = fetchBaseQuery({
  baseUrl: `${getBaseUrl()}/api/books`,
  credentials: 'include',
  prepareHeaders: async (headers, { getState }) => {
    const token = getState().auth.token;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
})

const booksApi = createApi({
  reducerPath: 'booksApi',
  baseQuery,
  tagTypes: ['Books'],
  endpoints: (builder) => ({
    fetchAllBooks: builder.query({
      query: () => "/",
      transformResponse: (response) => response.books,
      providesTags: ["Books"]
    }),
    searchBooks: builder.query({
      // params: { query, category, minPrice, maxPrice, sort, page, limit }
      query: (params) => ({ url: `/search`, params }),
      providesTags: ["Books"]
    }),
    fetchTopBooks: builder.query({
      query: (limit = 10) => ({ url: `/top`, params: { limit } }),
      providesTags: ["Books"]
    }),
    fetchRecommendedBooks: builder.query({
      query: ({ category, limit = 10 } = {}) => ({ url: `/recommended`, params: { category, limit } }),
      providesTags: ["Books"]
    }),
    fetchCategories: builder.query({
      query: () => ({ url: `/categories` }),
      transformResponse: (resp) => resp?.categories || [],
      providesTags: ["Books"],
    }),
    fetchBookById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: 'Books', id }],
    }),
    addBook: builder.mutation({
      query: (newBook) => ({
        url: '/create-book',
        method: 'POST',
        body: newBook,
      }),
      invalidatesTags: ['Books'],
    }),
    updateBook: builder.mutation({
      query: ({ id, ...updatedBook }) => ({
        url: `/edit/${id}`,
        method: 'PUT',
        body: updatedBook,
        headers: {
          'Content-type': 'application/json',
        }
      }),
      invalidatesTags:['Books'],
    }),
    deleteBook: builder.mutation({
      query: (id) => ({
        url: `/delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Books'],
    }),
  })
})

export const { useFetchAllBooksQuery, useSearchBooksQuery, useFetchTopBooksQuery, useFetchRecommendedBooksQuery, useFetchCategoriesQuery,
  useFetchBookByIdQuery, useAddBookMutation, useUpdateBookMutation, useDeleteBookMutation } = booksApi;
export default booksApi;