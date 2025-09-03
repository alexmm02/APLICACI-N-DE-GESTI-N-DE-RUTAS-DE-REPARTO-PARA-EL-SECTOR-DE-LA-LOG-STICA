import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui";
import { useOwnerRoutes } from "../../context/ownerContext/OwnerRouteContext";
import { useOwnerCompanies } from "../../context/ownerContext/OwnerCompanyContext"; 

function EmployeeRoutesPage() {
  const { userId, companyId } = useParams(); 
  const navigate = useNavigate();

  const {
    routes,
    routePackages,
    loadUserRoutes,
    deleteRoute,
    loadRoutePackages,
  } = useOwnerRoutes();

  const {
    employee,
    loadEmployeeById,
  } = useOwnerCompanies(); 

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedRouteId, setExpandedRouteId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          loadUserRoutes(userId),
          loadEmployeeById(companyId, userId),
        ]);
      } catch {
        setError("Error loading routes");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, companyId]);

  const togglePackages = async (routeId) => {
    if (expandedRouteId === routeId) {
      setExpandedRouteId(null);
      return;
    }

    try {
      await loadRoutePackages(companyId, userId, routeId);
      setExpandedRouteId(routeId);
    } catch (err) {
      console.error("❌ Error fetching route packages:", err);
    }
  };

  const handleDelete = async (routeId) => {
    const confirm = window.confirm("Are you sure you want to delete this route?");
    if (!confirm) return;

    try {
      await deleteRoute(companyId, userId, routeId);
    } catch (err) {
      alert("Error deleting the route");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-8 text-gray-800">
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">
              🛣️ {employee?.name ? `${employee.name}'s Routes` : "User Routes"}
            </h1>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
              onClick={() =>
                navigate(`/owner/company/${companyId}/user/${userId}/routes/new`)
              }
            >
              ➕ Add Route
            </button>
          </div>

          {loading && <p className="text-center text-gray-600">Loading routes...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}
          {!loading && routes.length === 0 && (
            <p className="text-center text-gray-500">No routes for this user.</p>
          )}

          <ul className="space-y-4">
            {routes.map((route) => (
              <li key={route.id}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <strong>{route.name}</strong> — Status: {route.status}
                  </div>
                  <div className="mt-2 sm:mt-0 flex flex-wrap gap-2">
                    <button
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                      onClick={() => togglePackages(route.id)}
                    >
                      {expandedRouteId === route.id ? "Hide Packages" : "View Packages"}
                    </button>
                    <button
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                      onClick={() =>
                        navigate(`/owner/company/${companyId}/user/${userId}/routes/${route.id}/edit`)
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

                {expandedRouteId === route.id && routePackages.length > 0 && (
                  <ul className="mt-2 ml-4 list-disc text-sm text-gray-700">
                    {routePackages.map((pkg) => (
                      <li key={pkg.id}>
                        {pkg.name} — {pkg.destinationaddress}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default EmployeeRoutesPage;
