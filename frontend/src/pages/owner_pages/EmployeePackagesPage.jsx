import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "../../components/ui";
import { useOwnerPackages } from "../../context/ownerContext/OwnerPackageContext";
import { useOwnerCompanies } from "../../context/ownerContext/OwnerCompanyContext"; 

function EmployeePackagesPage() {
  const { userId, companyId } = useParams();
  const navigate = useNavigate();

  const {
    packages,
    loadUserPackages,
    deletePackage,
    errors: packageErrors,
  } = useOwnerPackages();

  const {
    employee,
    loadEmployeeById,
  } = useOwnerCompanies(); 

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        loadUserPackages(userId),
        loadEmployeeById(companyId, userId), 
      ]);
      setLoading(false);
    };
    fetchData();
  }, [userId, companyId]);

  const handleDelete = async (packageId) => {
    const confirm = window.confirm("Are you sure you want to delete this package?");
    if (!confirm) return;

    try {
      await deletePackage(companyId, userId, packageId);
    } catch (err) {
      alert("Error deleting the package");
      console.error(err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-8 text-gray-800">
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">
              📦 {employee?.name ? `${employee.name}'s Packages` : "User Packages"}
            </h1>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-md"
              onClick={() =>
                navigate(`/owner/company/${companyId}/user/${userId}/packages/new`)
              }
            >
              ➕ Add Package
            </button>
          </div>

          {loading && <p className="text-gray-600 text-center">Loading packages...</p>}
          {packageErrors?.length > 0 && (
            <p className="text-red-500 text-center">{packageErrors.join(", ")}</p>
          )}
          {!loading && packages.length === 0 && (
            <p className="text-center text-gray-500">No packages found for this user.</p>
          )}

          {packages.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {packages.map((pkg) => (
                <li key={pkg.id} className="py-3 flex justify-between items-center">
                  <div>
                    <strong>{pkg.name}</strong> — {pkg.destinationaddress}
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
                      onClick={() =>
                        navigate(`/owner/company/${companyId}/user/${userId}/packages/${pkg.id}/edit`)
                      }
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

export default EmployeePackagesPage;
