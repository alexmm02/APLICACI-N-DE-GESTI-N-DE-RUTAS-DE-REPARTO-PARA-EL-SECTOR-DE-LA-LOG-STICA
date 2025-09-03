import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Input, Label } from "../../components/ui";
import { useNavigate, useParams, Link } from "react-router-dom";

function ResetPasswordPage() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordConfirmed, setPasswordConfirmed] = useState("");
  const { resetPassword, errors, message } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== passwordConfirmed) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    await resetPassword(token, newPassword);
    setLoading(false);

    if (!errors) {
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h3 className="text-2xl font-bold mb-4 text-center">Reset Password</h3>

        {errors && errors.map((err, index) => (
          <p key={index} className="bg-red-100 text-red-700 border border-red-300 p-2 rounded text-sm text-center mb-2">
            {err}
          </p>
        ))}

        {message && (
          <p className="bg-green-100 text-green-700 border border-green-300 p-2 rounded text-sm text-center mb-4">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="passwordConfirmed">Confirm Password</Label>
            <Input
              type="password"
              placeholder="Confirm your new password"
              value={passwordConfirmed}
              onChange={(e) => setPasswordConfirmed(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </Button>

          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <p>Recovered your account?</p>
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Log In
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ResetPasswordPage;
