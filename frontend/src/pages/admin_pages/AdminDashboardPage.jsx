import { useNavigate } from "react-router-dom";
import { Button, Card } from "../../components/ui";

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800">
      <div className="w-full max-w-3xl mx-auto">
        <Card className="text-center">
          <h1 className="text-4xl font-bold mb-4">🔧 Admin Dashboard</h1>
          <p className="text-lg mb-6">
            Welcome to the <strong>FastRoute</strong> administration panel.
            From here you can manage users, packages, routes, support, and companies.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
            <Button 
              className="bg-blue-500 hover:bg-blue-600 text-lg px-6 py-3"
              onClick={() => navigate("/admin-dashboard/users")}
            >
              👥 Manage Users
            </Button>

            <Button 
              className="bg-green-500 hover:bg-green-600 text-lg px-6 py-3"
              onClick={() => navigate("/admin-dashboard/packages")}
            >
              📦 Manage Packages
            </Button>

            <Button 
              className="bg-purple-500 hover:bg-purple-600 text-lg px-6 py-3"
              onClick={() => navigate("/admin-dashboard/routes")}
            >
              🗺 Manage Routes
            </Button>

            <Button 
              className="bg-yellow-500 hover:bg-yellow-600 text-lg px-6 py-3"
              onClick={() => navigate("/admin-dashboard/support")}
            >
              🛠 Manage Support
            </Button>

            <Button 
              className="bg-cyan-500 hover:bg-cyan-600 text-lg px-6 py-3 col-span-1 sm:col-span-2"
              onClick={() => navigate("/admin-dashboard/companies")}
            >
              🏢 Manage Companies
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminDashboard;
