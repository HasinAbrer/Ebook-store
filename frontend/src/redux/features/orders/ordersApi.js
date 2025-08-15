import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../utils/baseURL";


const ordersApi = createApi({
    reducerPath: 'ordersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/orders`,
        credentials: 'include',
        prepareHeaders: (headers) => {
            const path = typeof window !== 'undefined' ? window.location.pathname : '';
            const token = path.startsWith('/dashboard')
                ? localStorage.getItem('admin_token')
                : localStorage.getItem('token');
            if (token) headers.set('Authorization', `Bearer ${token}`);
            return headers;
        }
    }),
    tagTypes: ['Orders'],
    endpoints: (builder) => ({
        createOrder: builder.mutation({
            query: (newOrder) => ({
                url: "/",
                method: "POST",
                body: newOrder,
                credentials: 'include',
            })
        }),
        getOrderByEmail: builder.query({
            query: (email) => ({
                url: `/email/${email}`
            }),
            providesTags: ['Orders']
        }),
        // Admin: get all orders
        getAllOrders: builder.query({
            query: () => ({
                url: `/`,
            }),
            providesTags: ['Orders']
        }),
        // Admin: update order status
        updateOrderStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Orders']
        })
    })
})

export const {useCreateOrderMutation, useGetOrderByEmailQuery, useGetAllOrdersQuery, useUpdateOrderStatusMutation} = ordersApi;

export default ordersApi;