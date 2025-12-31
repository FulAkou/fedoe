import { Clock, Package } from 'lucide-react';
import { useEffect } from 'react';
import Loader from '../components/ui/Loader';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

const Profile = () => {
  const { user, isLoading: authLoading } = useAuthStore();
  const { userOrders, isLoading: ordersLoading, fetchUserOrders } = useOrderStore();

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  if (authLoading || ordersLoading) return <Loader size="large" />;
  if (!user) return <div className="text-center mt-20">Please log in to view your profile.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-8 mb-8 border border-gray-100 dark:border-slate-700">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
             <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
             <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
             <div className="flex items-center gap-2 mt-2">
               <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-gray-300">
                 {user.role}
               </span>

             </div>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-gray-100">
        <Package className="text-primary" /> Order History
      </h2>

      <div className="space-y-4">
        {userOrders.length > 0 ? (
          userOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-slate-800 border dark:border-slate-700 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-4">
                <div>
                   <span className="text-sm text-gray-400">Order #{order.id.slice(-6)}</span>
                   <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                     <Clock size={14} />
                     {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                   </div>
                </div>
                <div className="mt-2 md:mt-0">
                  <span className={`px-4 py-2 rounded-lg text-sm font-bold capitalize ${
                    order.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                    order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {order.status.toLowerCase()}
                  </span>
                </div>
              </div>
              <div className="border-t dark:border-slate-700 pt-4 flex justify-between items-center">
                 <div className="text-sm text-gray-600 dark:text-gray-400">{order.items?.length || 0} items</div>
                 <div className="text-xl font-bold text-gray-900 dark:text-gray-100">${order.total?.toFixed(2)}</div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
