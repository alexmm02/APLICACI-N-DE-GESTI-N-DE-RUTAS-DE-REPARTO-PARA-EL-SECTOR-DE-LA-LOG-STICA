import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminRoutes } from "../../../context/adminContext/AdminRouteContext";
import { useAdminPackages } from "../../../context/adminContext/AdminPackageContext";
import { Card, Input, Label, Button } from "../../../components/ui";

function AdminEditRoutePage() {
  const { userId, routeId } = useParams();
  const isEdit = !!routeId;
  const navigate = useNavigate();

  const {
    route,
    routePackages,
    loadRoute,
    loadRoutePackages,
    createRoute,
    updateRoute,
    errors: routeErrors,
  } = useAdminRoutes();

  const {
    packages,
    loadUserPackages,
    errors: packageErrors,
  } = useAdminPackages();

  const [routeName, setRouteName] = useState("");
  const [status, setStatus] = useState("pending");
  const [selectedPackages, setSelectedPackages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadUserPackages(userId);

        if (isEdit) {
          await loadRoute(routeId);
          await loadRoutePackages(routeId);
        }
      } catch (err) {
        console.error("Error loading initial data", err);
        setLocalError("Failed to load data");
      }
    };

    loadData();
  }, [isEdit, routeId, userId]);

  useEffect(() => {
    if (isEdit && route) {
      setRouteName(route.name || "");
      setStatus(route.status || "pending");
    }

    if (isEdit && routePackages) {
      setSelectedPackages(routePackages.map((pkg) => pkg.id));
    }
  }, [route, routePackages, isEdit]);

  const handlePackageToggle = (pkgId) => {
    setSelectedPackages((prev) =>
      prev.includes(pkgId)
        ? prev.filter((id) => id !== pkgId)
        : [...prev, pkgId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await updateRoute(routeId, {
          name: routeName,
          status,
          packageIds: selectedPackages,
        });
      } else {
        await createRoute(userId, {
          name: routeName,
          packageIds: selectedPackages,
        });
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      setLocalError("Error saving changes");
    } finally {
      setLoading(false);
    }
  };

  const combinedErrors = [...(routeErrors || []), ...(packageErrors || []), ...(localError ? [localError] : [])];

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-8 text-gray-800 flex justify-center">
      <Card className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          {isEdit ? "✏️ Edit Route" : "➕ Create New Route"}
        </h1>

        {combinedErrors.length > 0 && (
          <p className="text-red-500 text-center mb-4">{combinedErrors.join(", ")}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Route Name</Label>
            <Input
              id="name"
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="Route name"
            />
          </div>

          {isEdit && (
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          )}

          <div>
            <Label>Assigned Packages</Label>
            <div className="max-h-48 overflow-auto border border-gray-300 p-2 bg-white rounded">
              {packages.map((pkg) => (
                <label key={pkg.id} className="flex items-center gap-2 py-1">
                  <input
                    type="checkbox"
                    value={pkg.id}
                    checked={selectedPackages.includes(pkg.id)}
                    onChange={() => handlePackageToggle(pkg.id)}
                    className="accent-blue-600"
                  />
                  {pkg.name} — {pkg.destinationaddress}
                </label>
              ))}
              {packages.length === 0 && (
                <p className="text-center text-gray-500">No packages available.</p>
              )}
            </div>
          </div>

          <div className="flex justify-between gap-2 pt-4">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 w-full"
              onClick={() => navigate(`/admin/user/${userId}/routes`)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 w-full"
              disabled={loading}
            >
              {loading
                ? isEdit
                  ? "Saving..."
                  : "Creating..."
                : isEdit
                ? "Save Changes"
                : "Create Route"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default AdminEditRoutePage;
