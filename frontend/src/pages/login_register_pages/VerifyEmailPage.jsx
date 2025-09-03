import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function VerifyEmailPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { verifyEmail, message, errors } = useAuth();

  useEffect(() => {
    const verify = async () => {
      await verifyEmail(token);
      setTimeout(() => navigate("/login"), 3000);
    };

    verify();
  }, [token, navigate]);

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center px-4 py-10 text-gray-800">
      <div className="bg-white border border-gray-200 p-10 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-3xl font-bold mb-4">Verifying email...</h2>

        {message && (
          <p className="bg-green-100 text-green-700 border border-green-300 p-3 rounded">
            {message}
          </p>
        )}

        {errors && (
          <p className="bg-red-100 text-red-700 border border-red-300 p-3 rounded">
            {errors}
          </p>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
