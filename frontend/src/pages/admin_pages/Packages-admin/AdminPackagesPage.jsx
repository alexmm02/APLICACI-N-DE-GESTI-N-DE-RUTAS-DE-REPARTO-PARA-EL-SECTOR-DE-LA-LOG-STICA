import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminPackages } from "../../../context/adminContext/AdminPackageContext";
import { Button, Card } from "../../../components/ui";

function AdminPackages() {
  const { packages, loadPackages, deletePackage } = useAdminPackages();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPackages();
  }, []);

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800">
      <div className="w-full max-w-5xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6">📦 Package Management</h1>

          <div className="mb-6 flex justify-center">
            <input
              type="text"
              placeholder="Search packages by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          {filteredPackages.length === 0 ? (
            <p className="text-center text-gray-500">No packages found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-gray-200 rounded shadow-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Address</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">User</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPackages.map((pkg) => (
                    <tr key={pkg.id} className="border-t border-gray-200">
                      <td className="p-3">{pkg.id}</td>
                      <td className="p-3">{pkg.name}</td>
                      <td className="p-3">{pkg.destinationaddress}</td>
                      <td className="p-3">{pkg.priority}</td>
                      <td className="p-3">{pkg.user_id}</td>
                      <td className="p-3 flex flex-wrap justify-center gap-2">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => navigate(`/admin/packages/${pkg.id}/edit`)}
                        >
                          Edit
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => deletePackage(pkg.id)}
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

export default AdminPackages;
