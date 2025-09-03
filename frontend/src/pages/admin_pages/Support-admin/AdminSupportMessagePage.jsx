import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminSupport } from "../../../context/adminContext/AdminSupportContext";
import { Button, Card } from "../../../components/ui";

function AdminSupportMessage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadMessage, updateMessage } = useAdminSupport();

  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await loadMessage(id);
        setMessage(data);
      } catch (err) {
        setError("Error loading support message.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessage();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await updateMessage(id, { status: newStatus });
      setMessage({ ...message, status: newStatus });
    } catch (err) {
      console.error("Error updating message status:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800">
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6">📩 Support Message</h1>

          {loading && <p className="text-center text-gray-600">Loading message...</p>}
          {error && <p className="text-red-500 text-center">{error}</p>}

          {message && (
            <>
              <div className="space-y-2 mb-4">
                <p><strong>User:</strong> {message.user_name}</p>
                <p><strong>Category:</strong> {message.category}</p>
                <p><strong>Date:</strong> {new Date(message.created_at).toLocaleDateString()}</p>
              </div>

              <div className="mb-6">
                <p className="text-lg font-semibold mb-2">Message:</p>
                <div className="bg-gray-100 text-gray-800 p-4 rounded-md border border-gray-200 whitespace-pre-line">
                  {message.message}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-lg font-bold mb-2">Status:</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 bg-white shadow-sm focus:outline-none"
                  value={message.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="En proceso">En Proceso</option>
                  <option value="Resuelto">Resuelto</option>
                </select>
              </div>

              <div className="flex justify-center">
                <Button
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  onClick={() => navigate("/admin-dashboard/support")}
                >
                  Back
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminSupportMessage;
