import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllUsersApi, updateUserRoleApi } from "../../api/adminApi";
import { useAuth } from "../../hooks/useAuth";

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await getAllUsersApi();
      setUsers(data.users);
    } catch (err) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    try {
      await updateUserRoleApi(id, newRole);
      toast.success("User role updated");
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update role");
    }
  };

  if (loading) return <p className="text-textSecondary">Loading users...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="bg-surface rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surfaceHover text-textSecondary text-left">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t border-surfaceHover">
                <td className="p-4">{u.name}</td>
                <td className="p-4 text-textSecondary">{u.email}</td>
                <td className="p-4">
                  <select
                    value={u.role}
                    disabled={u._id === currentUser._id}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="bg-background px-3 py-1.5 rounded-md text-sm disabled:opacity-50"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td className="p-4 text-textSecondary">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;