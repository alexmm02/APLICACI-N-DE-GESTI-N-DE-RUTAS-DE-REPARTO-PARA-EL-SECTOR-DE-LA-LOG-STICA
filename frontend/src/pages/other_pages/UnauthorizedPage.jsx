import { Link } from "react-router-dom";

function UnauthorizedPage() {
  return (
    <div className="text-center mt-10">
      <h1 className="text-3xl font-bold text-red-600">⛔ Access Denied</h1>
      <p className="text-lg mt-2">You do not have permission to access this page.</p>
      <Link to="/login" className="text-blue-500 mt-4 inline-block">Back to Home</Link>
    </div>
  );
}

export default UnauthorizedPage;
