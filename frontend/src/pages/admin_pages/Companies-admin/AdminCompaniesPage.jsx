import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui";
import { useAdminCompanies } from "../../../context/adminContext/AdminCompanyContext";

function AdminCompaniesPage() {
  const {
    companies,
    loadCompanies,
    deleteCompany,
    errors,
  } = useAdminCompanies();

  const navigate = useNavigate();

  useEffect(() => {
    loadCompanies();
  }, []);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this company?");
    if (!confirm) return;
    await deleteCompany(id);
  };

  return (
    <div className="px-4 py-8 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold mb-6 text-center">🏢 Registered Companies</h1>
          {companies.length === 0 && !errors.length ? (
            <p className="text-center text-gray-500">No companies registered.</p>
          ) : errors.length > 0 ? (
            <p className="text-center text-red-500">{errors[0]}</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {companies.map((company) => (
                <li key={company.id} className="py-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-lg">{company.name}</p>
                    <p className="text-sm text-gray-600">
                      Code: <code>{company.join_code}</code>
                    </p>
                    <p className="text-sm text-gray-600">
                      Owner: {company.owner_name ? `${company.owner_name} (${company.owner_email})` : "Deleted user"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md"
                      onClick={() => navigate(`/admin-dashboard/companies/${company.id}/employees`)}
                    >
                      View Employees
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                      onClick={() => handleDelete(company.id)}
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

export default AdminCompaniesPage;
