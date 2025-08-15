import React from 'react';
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from '../../../redux/features/orders/ordersApi';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const { data: orders = [], isLoading, isError, refetch } = useGetAllOrdersQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateOrderStatusMutation();

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateStatus({ id: orderId, status: newStatus }).unwrap();
      // refetch after update to ensure UI is fresh (also handled by tags)
      refetch();
    } catch (e) {
      console.error('Failed to update status', e);
      alert('Failed to update status');
    }
  };

  if (isLoading) return <div>Loading orders...</div>;
  if (isError) return <div>Failed to load orders</div>;

  return (
    <section className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">All Orders</h2>
        <button onClick={() => refetch()} className="px-3 py-1 text-sm bg-gray-100 rounded hover:bg-gray-200">Refresh</button>
      </div>
      {orders.length === 0 ? (
        <div>No orders yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placed</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((o, idx) => (
                <tr key={o._id}>
                  <td className="px-4 py-2 text-sm text-gray-700">{idx + 1}</td>
                  <td className="px-4 py-2 text-sm font-mono">{o._id}</td>
                  <td className="px-4 py-2 text-sm">
                    <div className="font-semibold">{o.name}</div>
                    <div className="text-gray-500">{o.email}</div>
                    <div className="text-gray-500 text-xs">{o.address?.city}, {o.address?.state}, {o.address?.country}</div>
                  </td>
                  <td className="px-4 py-2 text-sm">{o.phone}</td>
                  <td className="px-4 py-2 text-sm font-semibold">${o.totalPrice?.toFixed?.(2) ?? o.totalPrice}</td>
                  <td className="px-4 py-2 text-sm">
                    <select
                      className="border rounded px-2 py-1"
                      value={o.status}
                      onChange={(e) => handleStatusChange(o._id, e.target.value)}
                      disabled={isUpdating}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default AdminOrders;
