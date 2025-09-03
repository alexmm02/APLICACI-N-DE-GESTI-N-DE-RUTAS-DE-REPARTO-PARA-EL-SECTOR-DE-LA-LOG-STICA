import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Input, Label } from "../../components/ui";
import { useOwnerRoutes } from "../../context/ownerContext/OwnerRouteContext";
import { useOwnerPackages } from "../../context/ownerContext/OwnerPackageContext";

function EmployeeRouteFormPage() {
  const navigate = useNavigate();
  const { userId, companyId, routeId } = useParams();

  const {
    route,
    routePackages,
    loadRouteById,
    loadRoutePackages,
    createRoute,
    updateRoute,
  } = useOwnerRoutes();

  const { packages, loadUserPackages } = useOwnerPackages();

  const [routeName, setRouteName] = useState("");
  const [status, setStatus] = useState("pendiente");
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPackagesAndRoute = async () => {
      try {
        await loadUserPackages(userId);

        if (routeId) {
          const updatedRoute = await loadRouteById(companyId, userId, routeId);
          setRouteName(updatedRoute.name);
          setStatus(updatedRoute.status);

          const res = await loadRoutePackages(companyId, userId, routeId);
          setSelectedPackages(res.map((pkg) => pkg.id));
        }
      } catch (err) {
        console.error("❌ Error loading route or available packages", err);
        setError("Error loading route or available packages");
      }
    };

    loadPackagesAndRoute();
  }, [routeId, userId, companyId, loadUserPackages, loadRouteById, loadRoutePackages]);

  const handlePackageSelection = (packageId) => {
    setSelectedPackages((prev) =>
      prev.includes(packageId)
        ? prev.filter((id) => id !== packageId)
        : [...prev, packageId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!routeName || selectedPackages.length === 0) {
      setError("You must enter a name and select at least one package.");
      return;
    }

    setLoading(true);
    try {
      if (routeId) {
        await updateRoute(companyId, userId, routeId, {
          name: routeName,
          status,
          packageIds: selectedPackages,
        });
      } else {
        await createRoute(companyId, userId, {
          name: routeName,
          packageIds: selectedPackages,
        });
      }
      navigate(`/owner/company/${companyId}/user/${userId}/routes`);
    } catch (err) {
      setError("Error saving the route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex justify-center items-start md:pt-20 pt-12 pb-10 px-4 text-gray-800 bg-gray-50">
      <Card className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          🚚 {routeId ? "Edit Employee Route" : "Create New Route for Employee"}
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="routeName">Route Name</Label>
            <Input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="e.g. Route 1"
            />
          </div>

          {routeId && (
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="pendiente">Pending</option>
                <option value="en progreso">In Progress</option>
                <option value="completada">Completed</option>
              </select>
            </div>
          )}

          <div>
            <Label>Select Packages</Label>
            <div className="max-h-40 overflow-auto border border-gray-300 p-2 rounded-md bg-white">
              {Array.isArray(packages) && packages.length > 0 ? (
                packages.map((pkg) => (
                  <label key={pkg.id} className="flex items-center gap-2 p-1">
                    <input
                      type="checkbox"
                      value={pkg.id}
                      checked={selectedPackages.includes(pkg.id)}
                      onChange={() => handlePackageSelection(pkg.id)}
                      className="accent-blue-600"
                    />
                    {pkg.name} - {pkg.destinationaddress}
                  </label>
                ))
              ) : (
                <p className="text-center text-gray-500">No packages available</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
              onClick={() => navigate(`/owner/company/${companyId}/user/${userId}/routes`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
              disabled={loading}
            >
              {loading
                ? routeId
                  ? "Saving..."
                  : "Creating..."
                : routeId
                ? "Save"
                : "Create Route"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default EmployeeRouteFormPage;
