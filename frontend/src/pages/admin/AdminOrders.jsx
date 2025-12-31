import { useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';
import { useOrderStore } from '../../store/orderStore';

const AdminOrders = () => {
  const { orders, isLoading, fetchAllOrders, updateOrderStatus } = useOrderStore();

  useEffect(() => {
    fetchAllOrders();
  }, [fetchAllOrders]);

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success('Order status updated');
    } else {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) return <Loader size="large" />;

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100">Orders Management</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border dark:border-slate-700 p-4 rounded-lg flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <div className="font-bold text-gray-800 dark:text-gray-200">Order #{order.id.slice(-6)}</div>
              <div className="text-sm text-gray-500">{order.user?.name} ({order.user?.email})</div>
              <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</div>
            </div>
            <div className="flex items-center gap-4">
               <div className="text-right">
                  <div className="font-bold text-slate-900">{order.total?.toLocaleString()} FCFA</div>
                  <div className="text-xs text-gray-400">{order.items?.length || 0} items</div>
               </div>
               <select 
                 value={order.status}
                 onChange={(e) => handleStatusChange(order.id, e.target.value)}
                 className={`border rounded px-2 py-1 text-sm font-semibold outline-none
                   ${order.status === 'COMPLETED' ? 'border-green-200 text-green-700 bg-green-50' : 
                     order.status === 'CANCELLED' ? 'border-red-200 text-red-700 bg-red-50' : 
                     'border-blue-200 text-blue-700 bg-blue-50'}`}
               >
                 <option value="PENDING">Pending</option>
                 <option value="CONFIRMED">Confirmed</option>
                 <option value="PREPARING">Preparing</option>
                 <option value="READY">Ready</option>
                 <option value="COMPLETED">Completed</option>
                 <option value="CANCELLED">Cancelled</option>
               </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
