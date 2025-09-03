import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useAdminUsers } from "../../../context/adminContext/AdminUserContext";
import { Button, Card } from "../../../components/ui";
import { useNavigate } from "react-router-dom";

function AdminUsers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { users, loadUsers, deleteUser } = useAdminUsers();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await loadUsers();
      } catch (err) {
        setError("Error loading users");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800">
      <div className="w-full max-w-5xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6">👥 User Management</h1>

          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search users by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {loading && <p className="text-center text-gray-600">Loading users...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {!loading && !error && filteredUsers.length === 0 && (
            <p className="text-center text-gray-500">No users found.</p>
          )}

          {!loading && !error && filteredUsers.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-gray-200 rounded shadow-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Verified</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-t border-gray-200">
                      <td className="p-3">{u.id}</td>
                      <td className="p-3">{u.name}</td>
                      <td className="p-3">{u.email}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">{u.is_verified ? "✅ Yes" : "❌ No"}</td>
                      <td className="p-3 flex flex-wrap gap-2 justify-center">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => navigate(`/admin/users/${u.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => deleteUser(u.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          className="bg-purple-500 hover:bg-purple-600 text-white"
                          onClick={() => navigate(`/admin/user/${u.id}/packages`)}
                        >
                          View Packages
                        </Button>
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => navigate(`/admin/user/${u.id}/routes`)}
                        >
                          View Routes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminUsers;
