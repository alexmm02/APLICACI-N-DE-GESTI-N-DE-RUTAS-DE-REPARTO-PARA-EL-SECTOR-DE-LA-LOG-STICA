import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PackageCard from "../../components/packages/PackageCard";
import { usePackages } from "../../context/PackageContext";
import MapPointGoogle from "../../components/maps/MapPointGoogle";
import { FaPlus } from "react-icons/fa";

function PackagesPage() {
  const { packages, loadPackages } = usePackages();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadPackages();
  }, []);

  const filteredPackages = packages.filter((pack) =>
    pack.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (packages.length === 0)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-10rem)] bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800">No packages found</h1>
        <button
          className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
          onClick={() => navigate("/packages/new")}
        >
          <FaPlus className="w-6 h-6" />
        </button>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 min-h-[calc(100vh-5rem)]">
      {/* Search Bar */}
      <div className="mb-4 flex justify-center">
        <input
          type="text"
          placeholder="Search packages by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded px-4 py-2 w-full max-w-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPackages.map((pack) => (
          <PackageCard pack={pack} key={pack.id} />
        ))}
      </div>

      {filteredPackages.length > 0 && (
        <div className="map-container my-6 border border-gray-300 bg-white rounded-lg shadow-sm overflow-hidden">
          <MapPointGoogle packages={filteredPackages} />
        </div>
      )}

      <div className="flex justify-center gap-4 my-6">
        <button
          className="bg-blue-500 hover:bg-blue-400 text-white py-2 px-5 rounded-lg shadow transition"
          onClick={() => navigate("/select-packages")}
        >
          Select Packages
        </button>
      </div>

      <button
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg"
        onClick={() => navigate("/packages/new")}
      >
        <FaPlus className="w-6 h-6" />
      </button>
    </div>
  );
}

export default PackagesPage;
