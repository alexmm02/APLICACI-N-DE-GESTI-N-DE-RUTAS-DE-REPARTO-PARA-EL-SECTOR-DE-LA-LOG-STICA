import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminSupport } from "../../../context/adminContext/AdminSupportContext"
import { Button, Card } from "../../../components/ui";

function AdminSupport() {
  const {
    messages,
    loadMessages,
    updateMessage,
    deleteMessage,
    errors
  } = useAdminSupport();

  const navigate = useNavigate();

  useEffect(() => {
    loadMessages();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    await updateMessage(id, { status: newStatus });
    loadMessages();
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this message?");
    if (!confirm) return;

    await deleteMessage(id);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800">
      <div className="w-full max-w-5xl mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6">🛠 Support Management</h1>

          {errors.length > 0 && (
            <p className="text-red-500 text-center">{errors.join(", ")}</p>
          )}

          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No pending support messages.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border border-gray-200 rounded shadow-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Category</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className="border-t border-gray-200">
                      <td className="p-3">{msg.user_id || "Unknown user"}</td>
                      <td className="p-3">{msg.category}</td>
                      <td className="p-3">
                        <select
                          value={msg.status}
                          onChange={(e) => handleStatusChange(msg.id, e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded-md text-gray-800 bg-white shadow-sm focus:outline-none"
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="En proceso">En Proceso</option>
                          <option value="Resuelto">Resuelto</option>
                        </select>
                      </td>
                      <td className="p-3 flex flex-wrap justify-center gap-2">
                        <Button
                          className="bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => navigate(`/admin/support/${msg.id}`)}
                        >
                          View Message
                        </Button>
                        <Button
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => handleDelete(msg.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

export default AdminSupport;
