import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminCompanies } from "../../../context/adminContext/AdminCompanyContext";
import { Card } from "../../../components/ui";

function AdminCompanyEmployeesPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const {
    employees,
    loadEmployeesByCompany,
    removeEmployee,
    getCompanyById,
    errors,
  } = useAdminCompanies();

  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      await loadEmployeesByCompany(companyId);
      try {
        const company = await getCompanyById(companyId);
        setCompanyName(company.name);
      } catch (err) {
        console.error("Error fetching company name:", err);
      }
    };

    fetchData();
  }, [companyId]);

  return (
    <div className="px-4 py-8 bg-gray-50 min-h-screen text-gray-800">
      <div className="max-w-5xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold mb-6 text-center">
            👥 Employees of <span className="text-blue-600">{companyName || "..."}</span>
          </h1>

          {errors.length > 0 ? (
            <p className="text-center text-red-500">{errors[0]}</p>
          ) : employees.length === 0 ? (
            <p className="text-center text-gray-500">No employees registered in this company.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {employees.map((emp) => (
                <li key={emp.id} className="py-4">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                      <h2 className="text-lg font-semibold">{emp.name}</h2>
                      <p className="text-sm text-gray-600">{emp.email}</p>
                      <p className="text-sm text-gray-600">Role: {emp.role}</p>
                    </div>
                    <div className="mt-2 md:mt-0 flex flex-wrap gap-2">
                      <button
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded-md"
                        onClick={() => navigate(`/admin/user/${emp.id}/packages`)}
                      >
                        View Packages
                      </button>
                      <button
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md"
                        onClick={() => navigate(`/admin/user/${emp.id}/routes`)}
                      >
                        View Routes
                      </button>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                        onClick={() => navigate(`/admin/user/${emp.id}/clock-history`)}
                      >
                        View Workdays
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        onClick={() => {
                          const confirm = window.confirm("Are you sure you want to remove this employee?");
                          if (confirm) removeEmployee(companyId, emp.id);
                        }}
                      >
                        Remove
                      </button>
                    </div>
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

export default AdminCompanyEmployeesPage;
