import { useAuth } from "../../context/AuthContext";
import { Card, Button } from "../../components/ui";
import { Link } from "react-router-dom";

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 flex flex-col justify-center items-center text-gray-800 px-4">
      <Card className="max-w-2xl text-center p-8">
        <h1 className="text-4xl font-bold mb-4">🚚 Welcome to FastRoute</h1>
        <p className="text-lg mb-6">
          Optimize your delivery routes, manage your packages, and track your employees efficiently in real time.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/signin">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-lg">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg">
              Create Account
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}

export default HomePage;
