import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Card, Container, Input, Label } from "../../components/ui";
import { Link, useNavigate } from "react-router-dom";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { forgotPassword, errors, message } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await forgotPassword(email);
    setLoading(false);

    if (!errors) {
      navigate("/login");
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <h3 className="text-2xl font-bold mb-4 text-center">Recover Password</h3>

        {errors &&
          errors.map((err, index) => (
            <p
              key={index}
              className="bg-red-100 text-red-700 border border-red-300 p-2 rounded text-sm mb-2 text-center"
            >
              {err}
            </p>
          ))}

        {message && (
          <p className="bg-green-100 text-green-700 border border-green-300 p-2 rounded text-sm mb-4 text-center">
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send recovery email"}
          </Button>

          <div className="flex justify-between text-sm text-gray-600 mt-4">
            <p>Remember your password?</p>
            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
              Log In
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default ForgotPasswordPage;
