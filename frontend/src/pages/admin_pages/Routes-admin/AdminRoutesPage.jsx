import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminRoutes } from "../../../context/adminContext/AdminRouteContext";
import { Button, Card } from "../../../components/ui";

function AdminRoutesPage() {
  const { routes, loadRoutes, updateRouteStatus, deleteRoute } = useAdminRoutes();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadRoutes();
  }, []);

  const filteredRoutes = routes.filter(route =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800">
      <div className="w-full max-w-5xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6">🚛 Route Management</h1>

          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search routes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {filteredRoutes.length === 0 ? (
            <p className="text-center text-gray-500">No routes found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-gray-200 rounded shadow-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">User</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRoutes.map((route) => (
                    <tr key={route.id} className="border-t border-gray-200">
                      <td className="p-3">{route.name}</td>
                      <td className="p-3">
                        {route.user_name} ({route.email})
                      </td>
                      <td className="p-3">
                        <select
                          className="bg-white border border-gray-300 px-2 py-1 rounded-md text-gray-800 shadow-sm focus:outline-none"
                          value={route.status}
                          onChange={(e) => updateRouteStatus(route.id, e.target.value)}
                        >
                          <option value="pendiente">Pendiente</option>
                          <option value="en progreso">En Progreso</option>
                          <option value="completada">Completada</option>
                        </select>
                      </td>
                      <td className="p-3">
                        {new Date(route.created_at).toLocaleDateString()}
                      </td>
                      <td className="p-3 flex flex-wrap justify-center gap-2">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() =>
                            navigate(`/admin-dashboard/routes/${route.id}`)
                          }
                        >
                          View Details
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => deleteRoute(route.id)}
                        >
                          Delete
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

export default AdminRoutesPage;
