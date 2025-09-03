import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useOwnerCompanies } from "../../context/ownerContext/OwnerCompanyContext";
import { Card } from "../../components/ui";

function CompanyEmployeesPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const { employees, loadCompanyEmployees, removeEmployee, errors } = useOwnerCompanies();

  useEffect(() => {
    const fetchData = async () => {
      await loadCompanyEmployees(companyId);
    };
    fetchData();
  }, [companyId]);

  const handleExpel = async (userId) => {
    const confirm = window.confirm("Are you sure you want to expel this employee?");
    if (!confirm) return;

    await removeEmployee(companyId, userId);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-8 text-gray-800">
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6">👥 Company Employees</h1>

          {errors.length > 0 && (
            <p className="text-red-500 text-center">{errors.join(", ")}</p>
          )}

          {employees.length === 0 ? (
            <p className="text-center text-gray-500">There are no employees in this company.</p>
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
                        onClick={() =>
                          navigate(`/owner/company/${companyId}/user/${emp.id}/packages`)
                        }
                      >
                        View Packages
                      </button>
                      <button
                        className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md"
                        onClick={() =>
                          navigate(`/owner/company/${companyId}/user/${emp.id}/routes`)
                        }
                      >
                        View Routes
                      </button>
                      <button
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md"
                        onClick={() =>
                          navigate(`/owner/company/${companyId}/user/${emp.id}/clock-history`)
                        }
                      >
                        View Time Entries
                      </button>
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                        onClick={() => handleExpel(emp.id)}
                      >
                        Expel
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

export default CompanyEmployeesPage;
