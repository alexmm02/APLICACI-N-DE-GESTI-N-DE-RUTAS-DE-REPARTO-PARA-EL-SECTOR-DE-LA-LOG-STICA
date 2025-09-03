import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOwnerCompanies } from "../../context/ownerContext/OwnerCompanyContext";
import { Card, Button } from "../../components/ui";
import { FaPlus, FaUsers, FaRegCopy, FaTrash } from "react-icons/fa";

function MyCompaniesPage() {
  const { companies, loadMyCompanies, deleteCompany, errors } = useOwnerCompanies(); 
  const [copiedCompanyId, setCopiedCompanyId] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      await loadMyCompanies(); 
      setLoading(false); 
    };
    fetchData();
  }, []);

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCompanyId(id);
    setTimeout(() => setCopiedCompanyId(null), 2000);
  };

  const handleDeleteCompany = async (companyId) => {
    const confirmed = window.confirm("Are you sure you want to delete this company?");
    if (confirmed) {
      await deleteCompany(companyId);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-8 text-gray-800">
      <div className="max-w-4xl w-full mx-auto">
        <Card className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold text-center mb-6">🏢 My Companies</h1>

          {loading && <p className="text-center text-gray-600">Loading companies...</p>}
          {errors.length > 0 && (
            <p className="text-red-500 text-center">{errors.join(", ")}</p>
          )}

          {!loading && errors.length === 0 && companies.length === 0 && (
            <p className="text-center text-gray-500">You don't have any registered companies.</p>
          )}

          {!loading && companies.length > 0 && (
            <ul className="divide-y divide-gray-200">
              {companies.map((company) => (
                <li key={company.id} className="py-4">
                  <h2 className="text-xl font-semibold mb-1">{company.name}</h2>
                  <p className="text-sm text-gray-600 mb-2">
                    Join Code: <span className="font-mono">{company.join_code}</span>
                    <button
                      onClick={() => copyToClipboard(company.join_code, company.id)}
                      className="ml-2 text-blue-600 hover:text-blue-400"
                    >
                      <FaRegCopy className="inline" />
                      {copiedCompanyId === company.id && (
                        <span className="ml-1 text-green-500">Copied!</span>
                      )}
                    </button>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={() => navigate(`/owner/company/${company.id}/employees`)}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <FaUsers className="inline-block mr-2" /> Employees
                    </Button>
                    <Button
                      onClick={() => handleDeleteCompany(company.id)}
                      className="bg-red-500 hover:bg-red-600 text-white"
                    >
                      <FaTrash className="inline-block mr-2" /> Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <button
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => navigate("/create-company")}
      >
        <FaPlus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default MyCompaniesPage;
