import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAdminCompanies } from "../../../context/adminContext/AdminCompanyContext";

function AdminClockHistoryPage() {
  const { userId } = useParams();
  const {
    loadMonthlyEntries,
    monthlyEntries,
    errors,
  } = useAdminCompanies();

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  const formatDate = (str) => new Date(str).toLocaleDateString();
  const formatTime = (str) => new Date(str).toLocaleTimeString();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await loadMonthlyEntries(userId, month, year);
      setLoading(false);
    };
    fetchData();
  }, [userId, month, year]);

  const calculateTotalHours = () => {
    return monthlyEntries.reduce((acc, entry) => {
      if (entry.clock_out) {
        const inTime = new Date(entry.clock_in);
        const outTime = new Date(entry.clock_out);
        const duration = (outTime - inTime) / 3600000;
        return acc + duration;
      }
      return acc;
    }, 0).toFixed(2);
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-8 text-gray-800">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">🧾 Employee Workdays</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md shadow-sm"
          >
            {[...Array(12)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white border border-gray-300 text-gray-800 px-3 py-2 rounded-md shadow-sm"
          >
            {[year - 1, year, year + 1].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading workdays...</p>
        ) : errors.length > 0 ? (
          <p className="text-red-500 text-center">{errors[0]}</p>
        ) : monthlyEntries.length === 0 ? (
          <p className="text-center text-gray-500">No workdays registered for this month.</p>
        ) : (
          <>
            <table className="w-full text-sm text-left border border-gray-200 mb-4 rounded overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2">📅 Date</th>
                  <th className="p-2">Check-in</th>
                  <th className="p-2">Check-out</th>
                  <th className="p-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {monthlyEntries.map((entry) => {
                  const entrada = new Date(entry.clock_in);
                  const salida = entry.clock_out ? new Date(entry.clock_out) : null;
                  const duracion = salida
                    ? ((salida - entrada) / 3600000).toFixed(2) + " h"
                    : "–";

                  return (
                    <tr key={entry.id} className="border-t border-gray-200">
                      <td className="p-2">{formatDate(entry.clock_in)}</td>
                      <td className="p-2">{formatTime(entry.clock_in)}</td>
                      <td className="p-2">{salida ? formatTime(entry.clock_out) : "In progress"}</td>
                      <td className="p-2">{duracion}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <p className="font-semibold text-center text-gray-700">
              ⏱️ Total hours worked: {calculateTotalHours()} h
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminClockHistoryPage;
