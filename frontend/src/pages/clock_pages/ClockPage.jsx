import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

function ClockPage() {
  const {
    clockIn,
    clockOut,
    getTodayEntry,
    getMonthlyEntries,
    message,
    errors,
  } = useAuth();

  const [todayEntry, setTodayEntry] = useState(null);
  const [monthEntries, setMonthEntries] = useState([]);
  const today = new Date();
  const [month] = useState(today.getMonth() + 1);
  const [year] = useState(today.getFullYear());
  const [localMessage, setLocalMessage] = useState("");

  const formatTime = (str) => new Date(str).toLocaleTimeString();
  const formatDate = (str) => new Date(str).toLocaleDateString();

  const fetchToday = async () => {
    const entry = await getTodayEntry();
    setTodayEntry(entry || null);
  };

  const fetchMonth = async () => {
    const entries = await getMonthlyEntries(month, year);
    setMonthEntries(entries || []);
  };

  const handleClockIn = async () => {
    await clockIn();
    setLocalMessage("✅ Clock-in registered");
    fetchToday();
    fetchMonth();
  };

  const handleClockOut = async () => {
    await clockOut();
    setLocalMessage("✅ Clock-out registered");
    fetchToday();
    fetchMonth();
  };

  useEffect(() => {
    fetchToday();
    fetchMonth();
  }, []);

  return (
    <div className="text-gray-800 bg-gray-50 px-4 py-8 max-w-4xl mx-auto min-h-[calc(100vh-5rem)]">
      <h1 className="text-3xl font-bold mb-6 text-center">🕒 Clock-In System</h1>

      {/* Today’s entry */}
      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 mb-6">
        <h2 className="text-xl font-semibold mb-3">📅 Today’s Workday</h2>
        {todayEntry ? (
          <div className="space-y-1">
            <p>🕒 Clock-in: {formatTime(todayEntry.clock_in)}</p>
            <p>
              🕔 Clock-out:{" "}
              {todayEntry.clock_out ? formatTime(todayEntry.clock_out) : "Not clocked out yet"}
            </p>
            <p>
              ⏱️ Duration:{" "}
              {todayEntry.clock_out
                ? (
                    (new Date(todayEntry.clock_out) - new Date(todayEntry.clock_in)) /
                    3600000
                  ).toFixed(2) + " h"
                : "In progress"}
            </p>
          </div>
        ) : (
          <p className="text-gray-500">You haven’t clocked in today.</p>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-4 mb-6 justify-center">
        <button
          onClick={handleClockIn}
          className="bg-green-500 hover:bg-green-600 text-white px-5 py-2 rounded-md shadow"
        >
          Clock In
        </button>
        <button
          onClick={handleClockOut}
          className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md shadow"
        >
          Clock Out
        </button>
      </div>

      {(localMessage || message || errors) && (
        <p className="text-center text-sm mb-4 text-blue-600">
          {errors?.[0] || message || localMessage}
        </p>
      )}

      <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">📆 History – {month}/{year}</h2>
        {monthEntries.length === 0 ? (
          <p className="text-gray-500">No records this month.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-300 bg-gray-100 text-gray-700">
                  <th className="py-2 px-2">📅 Date</th>
                  <th className="py-2 px-2">Clock-in</th>
                  <th className="py-2 px-2">Clock-out</th>
                  <th className="py-2 px-2">Duration</th>
                </tr>
              </thead>
              <tbody>
                {monthEntries.map((entry) => {
                  const inTime = new Date(entry.clock_in);
                  const outTime = entry.clock_out ? new Date(entry.clock_out) : null;
                  const duration = outTime
                    ? ((outTime - inTime) / 3600000).toFixed(2) + " h"
                    : "-";

                  return (
                    <tr key={entry.id} className="border-b border-gray-200">
                      <td className="py-2 px-2">{formatDate(entry.clock_in)}</td>
                      <td className="py-2 px-2">{formatTime(entry.clock_in)}</td>
                      <td className="py-2 px-2">{outTime ? formatTime(entry.clock_out) : "–"}</td>
                      <td className="py-2 px-2">{duration}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClockPage;
