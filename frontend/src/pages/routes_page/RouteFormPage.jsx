import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useRoutes } from "../../context/RoutesContext";
import { usePackages } from "../../context/PackageContext";
import { Button, Card, Input, Label } from "../../components/ui";

function RouteFormPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { packages, loadPackages } = usePackages();
  const { createRoute, updateRoute, loadRoute } = useRoutes();

  const [selectedPackages, setSelectedPackages] = useState([]);
  const [routeName, setRouteName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPackages();

    if (params.id) {
      loadRoute(params.id).then((route) => {
        setRouteName(route.name);
        setSelectedPackages(route.packages.map((pkg) => pkg.id));
      });
    }
  }, []);

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
      if (params.id) {
        await updateRoute(params.id, {
          name: routeName,
          packageIds: selectedPackages,
        });
      } else {
        await createRoute({
          name: routeName,
          packageIds: selectedPackages,
        });
      }

      navigate("/routes");
    } catch {
      setError("Error while saving the route.");
    } finally {
      setLoading(false);
    }
  };

  const sortedPackages = [...packages].sort((a, b) => {
    if (a.delivered === b.delivered) return 0;
    return a.delivered ? 1 : -1;
  });

  return (
    <div className="min-h-[calc(100vh-5rem)] flex justify-center items-start md:pt-20 pt-12 pb-10 px-4 text-gray-800 bg-gray-50">
      <Card className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-6">
          🚚 {params.id ? "Edit Route" : "Create New Route"}
        </h1>

        {error && <p className="text-red-600 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="routeName">Route Name</Label>
            <Input
              type="text"
              value={routeName}
              onChange={(e) => setRouteName(e.target.value)}
              placeholder="e.g. North Route"
            />
          </div>

          <div>
            <Label>Select Packages</Label>
            <div className="max-h-[60vh] overflow-auto border border-gray-300 p-2 rounded-md bg-white">
              {packages.length > 0 ? (
                sortedPackages.map((pkg) => (
                  <label
                    key={pkg.id}
                    className={`flex items-center gap-2 p-1 rounded ${pkg.delivered ? "bg-gray-100" : ""
                      }`}
                  >
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
                <p className="text-center text-gray-500">
                  No packages available
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-2 pt-2">
            <Button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 w-full sm:w-auto"
              onClick={() => navigate("/routes")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-green-500 hover:bg-green-600 w-full sm:w-auto"
              disabled={loading}
            >
              {loading
                ? params.id
                  ? "Saving..."
                  : "Creating..."
                : params.id
                  ? "Save"
                  : "Create Route"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default RouteFormPage;
