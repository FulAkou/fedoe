import { Trash2 } from "lucide-react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/ui/Loader";
import Pagination from "../../components/ui/Pagination";
import { useUserStore } from "../../store/userStore";

const AdminUsers = () => {
  const {
    users,
    isLoading,
    error,
    getAllUsers,
    updateUser,
    deleteUser,
    pagination,
  } = useUserStore();

  useEffect(() => {
    getAllUsers({ page: 1, limit: 10 });
  }, [getAllUsers]);

  const handlePageChange = (newPage) => {
    getAllUsers({ page: newPage, limit: 10 });
  };

  const handleRoleChange = async (userId, newRole) => {
    const result = await updateUser(userId, { role: newRole });
    if (result.success) {
      toast.success("User role updated");
    } else {
      toast.error("Failed to update role");
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(userId);
      if (result.success) toast.success("User deleted");
      else toast.error("Failed to delete user");
    }
  };

  if (isLoading && users.length === 0) return <Loader size="large" />;

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Users Management
        </h2>
        <span className="text-sm text-gray-500">Total: {pagination.total}</span>
      </div>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 uppercase text-xs">
              <th className="p-4 border-b dark:border-slate-700">User</th>
              <th className="p-4 border-b dark:border-slate-700">Email</th>
              <th className="p-4 border-b dark:border-slate-700">Role</th>

              <th className="p-4 border-b dark:border-slate-700 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
            {users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <td className="p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {user.name}
                  </span>
                </td>
                <td className="p-4 text-gray-600 dark:text-gray-400">
                  {user.email}
                </td>
                <td className="p-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="bg-transparent border border-gray-200 dark:border-slate-600 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                  >
                    <option value="USER">User</option>
                    <option value="STAFF">Staff</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>

                <td className="p-4 text-right">
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4 stroke-current" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AdminUsers;
