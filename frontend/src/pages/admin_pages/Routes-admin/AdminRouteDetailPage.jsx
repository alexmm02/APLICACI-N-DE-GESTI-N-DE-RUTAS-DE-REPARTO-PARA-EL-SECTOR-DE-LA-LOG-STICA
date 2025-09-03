import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminRoutes } from "../../../context/adminContext/AdminRouteContext";
import { Button, Card } from "../../../components/ui";

function AdminRouteDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { route, routePackages, loadRoute, loadRoutePackages } = useAdminRoutes();

  useEffect(() => {
    loadRoute(id);
    loadRoutePackages(id);
  }, [id]);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800">
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6">📍 Route Details</h1>

          {!route ? (
            <p className="text-center text-gray-600">Loading route data...</p>
          ) : (
            <>
              <div className="space-y-2 mb-6">
                <p><strong>Name:</strong> {route.name}</p>
                <p><strong>User:</strong> {route.user_name} ({route.email})</p>
                <p><strong>Status:</strong> {route.status}</p>
                <p><strong>Date:</strong> {new Date(route.created_at).toLocaleDateString()}</p>
              </div>

              <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">📦 Packages in this Route</h2>
                {routePackages.length > 0 ? (
                  <ul className="space-y-2">
                    {routePackages.map((pkg) => (
                      <li
                        key={pkg.id}
                        className="bg-gray-100 text-gray-800 p-3 rounded-md border border-gray-200"
                      >
                        <strong>{pkg.name}</strong> — {pkg.destinationaddress}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No packages in this route.</p>
                )}
              </div>

              <div className="flex justify-center mt-8">
                <Button
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  onClick={() => navigate("/admin-dashboard/routes")}
                >
                  Back to Routes
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminRouteDetailPage;
