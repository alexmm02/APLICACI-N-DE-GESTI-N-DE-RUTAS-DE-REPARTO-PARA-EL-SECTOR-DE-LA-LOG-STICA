import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminPackages } from "../../../context/adminContext/AdminPackageContext";
import { useAdminUsers } from "../../../context/adminContext/AdminUserContext";
import { Card, Button } from "../../../components/ui";

function AdminUserPackagesPage() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const {
    packages,
    loadUserPackages,
    deletePackage,
    errors,
  } = useAdminPackages();
  const { getUserById } = useAdminUsers();

  const [userName, setUserName] = useState("");

  useEffect(() => {
    loadUserPackages(userId);

    const fetchUserName = async () => {
      try {
        const user = await getUserById(userId);
        setUserName(user.name); // Usamos solo el campo "name"
      } catch (error) {
        setUserName("Unknown User");
      }
    };

    fetchUserName();
  }, [userId]);

  const handleDelete = async (packageId) => {
    const confirm = window.confirm("Are you sure you want to delete this package?");
    if (!confirm) return;
    await deletePackage(packageId);
  };

  return (
    <div className="px-4 py-8 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto">
        <Card>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-center sm:text-left">
              📦 Packages of {userName}
            </h1>
            <Button
              className="bg-green-500 hover:bg-green-600"
              onClick={() => navigate(`/admin/user/${userId}/packages/new`)}
            >
              ➕ Create Package
            </Button>
          </div>

          {errors.length > 0 ? (
            <p className="text-center text-red-500">{errors.join(", ")}</p>
          ) : packages.length === 0 ? (
            <p className="text-center text-gray-500">No packages registered for this user.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {packages.map((pkg) => (
                <li key={pkg.id} className="py-3 flex justify-between items-center">
                  <div>
                    <strong>{pkg.name}</strong> — {pkg.destinationaddress}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() => navigate(`/admin/packages/${pkg.id}/edit`)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleDelete(pkg.id)}
                    >
                      Delete
                    </button>
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

export default AdminUserPackagesPage;
