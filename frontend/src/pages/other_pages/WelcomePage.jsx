
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../../components/ui";

function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center animate-fadeIn">
      <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-lg text-gray-600 mb-6">Start managing your deliveries efficiently</p>

      <div className="flex gap-4">
        <Button onClick={() => navigate("/packages")} className="px-6 py-3">
          Go to Packages
        </Button>
        <Button onClick={() => navigate("/profile")} variant="outline" className="px-6 py-3">
          Go to Profile
        </Button>
        <Button onClick={() => navigate("/routes")} variant="outline" className="px-6 py-3">
          Go to Routes
        </Button>
      </div>
    </div>
  );
}

export default WelcomePage;
