import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminRoutes } from "../../../context/adminContext/AdminRouteContext";
import { useAdminUsers } from "../../../context/adminContext/AdminUserContext";
import { Card, Button } from "../../../components/ui";

function AdminUserRoutesPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { userRoutes, loadUserRoutes, deleteRoute, errors } = useAdminRoutes();
  const { getUserById } = useAdminUsers();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadUserRoutes(userId);
      try {
        const user = await getUserById(userId);
        setUserName(user.name);
      } catch {
        setUserName("Unknown");
      }
      setLoading(false);
    };

    fetchData();
  }, [userId]);

  const handleDelete = async (routeId) => {
    const confirm = window.confirm("Are you sure you want to delete this route?");
    if (!confirm) return;
    await deleteRoute(routeId);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-8 text-gray-800">
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              🗺️ Routes of {userName}
            </h1>
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={() => navigate(`/admin/user/${userId}/routes/new`)}
            >
              ➕ Create Route
            </Button>
          </div>

          {loading ? (
            <p className="text-center text-gray-500">Loading routes...</p>
          ) : errors.length > 0 ? (
            <p className="text-center text-red-500">{errors.join(", ")}</p>
          ) : userRoutes.length === 0 ? (
            <p className="text-center text-gray-500">This employee has no assigned routes.</p>
          ) : (
            <ul className="space-y-4">
              {userRoutes.map((route) => (
                <li key={route.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                    <div>
                      <strong>{route.name}</strong> — Status: {route.status}
                    </div>
                    <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() =>
                          navigate(`/admin/user/${userId}/routes/${route.id}/edit`)
                        }
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDelete(route.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminUserRoutesPage;
