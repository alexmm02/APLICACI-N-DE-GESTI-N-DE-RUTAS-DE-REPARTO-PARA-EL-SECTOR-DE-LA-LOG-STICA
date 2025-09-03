import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRoutes } from "../../context/RoutesContext";
import { Button, Card } from "../../components/ui";
import { FaPlus } from "react-icons/fa";

function RoutesPage() {
  const { routes, loadRoutes, deleteRoute, updateRouteStatus, getRoutePackages } = useRoutes();
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routePackages, setRoutePackages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadRoutes();
  }, []);

  const fetchRoutePackages = async (routeId) => {
    if (selectedRoute === routeId) {
      setSelectedRoute(null);
      setRoutePackages([]);
      return;
    }
    try {
      const packages = await getRoutePackages(routeId);
      setRoutePackages(packages);
      setSelectedRoute(routeId);
    } catch (err) {
      console.error("Error fetching route packages", err);
    }
  };

  const filteredRoutes = routes.filter((route) =>
    (route?.name || "").toLowerCase().includes((searchTerm || "").toLowerCase())
  );


  return (
    <div className="flex flex-col items-center bg-gray-50 text-gray-800 p-4 sm:p-6 min-h-[calc(100vh-5rem)]">
      <Card className="w-full max-w-6xl p-6 sm:p-8 bg-white shadow-md rounded-xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">🚚 My Routes</h1>

        {/* 🔍 Input de búsqueda */}
        {routes.length > 0 && (
          <div className="mb-4 flex justify-center">
            <input
              type="text"
              placeholder="Search routes by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
        )}

        {!routes.length && (
          <p className="text-center text-gray-500">You have no routes yet.</p>
        )}

        {routes.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-300 mt-4 text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-3 border border-gray-300">Name</th>
                  <th className="p-3 border border-gray-300">Status</th>
                  <th className="p-3 border border-gray-300">Date</th>
                  <th className="p-3 border border-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoutes.map((route) => (
                  <tr key={route.id} className="even:bg-gray-50">
                    <td className="p-3 border border-gray-200">{route.name}</td>
                    <td className="p-3 border border-gray-200">
                      <select
                        className="bg-white border border-gray-300 text-gray-800 p-2 rounded-md"
                        value={route.status}
                        onChange={(e) => updateRouteStatus(route.id, e.target.value)}
                      >
                        <option value="pendiente">Pending</option>
                        <option value="en progreso">In Progress</option>
                        <option value="completada">Completed</option>
                      </select>
                    </td>
                    <td className="p-3 border border-gray-200">
                      {new Date(route.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 border border-gray-200">
                      <div className="flex flex-wrap gap-1">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => fetchRoutePackages(route.id)}
                        >
                          {selectedRoute === route.id ? "Hide Packages" : "View Packages"}
                        </Button>
                        <Button
                          className="bg-yellow-500 hover:bg-yellow-600 text-white"
                          onClick={() => navigate(`/routes/${route.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => deleteRoute(route.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => navigate(`/navigation/${route.id}`)}
                        >
                          Start Route
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selectedRoute && (
        <Card className="w-full max-w-6xl mt-6 p-6 sm:p-8 bg-white shadow-md rounded-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-4">📦 Route Packages</h2>
          {routePackages.length > 0 ? (
            <ul className="space-y-2">
              {routePackages.map((pkg) => (
                <li key={pkg.id} className="bg-gray-100 border border-gray-300 p-3 rounded-md">
                  {pkg.name} - {pkg.destinationaddress}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500">No packages in this route.</p>
          )}
        </Card>
      )}

      <button
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => navigate("/select-packages")}
      >
        <FaPlus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default RoutesPage;
