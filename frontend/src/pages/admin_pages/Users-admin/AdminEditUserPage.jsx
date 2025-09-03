import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminUsers } from "../../../context/adminContext/AdminUserContext";
import { Button, Input, Label, Card } from "../../../components/ui";

function EditUserPage() {
  const { id } = useParams();  
  const navigate = useNavigate();  
  const { getUserById, updateUser } = useAdminUsers();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    role: "",
    is_verified: false,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserById(id);
        setUserData(user);
      } catch (err) {
        setError("Error loading user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, getUserById]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserData({
      ...userData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, userData);
      navigate("/admin-dashboard/users");
    } catch (err) {
      setError("Error updating user");
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800">
      <div className="w-full max-w-lg mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6">✏️ Edit User</h1>

          {loading ? (
            <p className="text-center text-gray-600">Loading user...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  value={userData.email}
                  disabled
                  className="bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  name="role"
                  value={userData.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                  <option value="owner">Owner</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_verified"
                  checked={userData.is_verified}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <Label htmlFor="is_verified" className="text-gray-800">Verified User</Label>
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  onClick={() => navigate("/admin-dashboard/users")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

export default EditUserPage;
