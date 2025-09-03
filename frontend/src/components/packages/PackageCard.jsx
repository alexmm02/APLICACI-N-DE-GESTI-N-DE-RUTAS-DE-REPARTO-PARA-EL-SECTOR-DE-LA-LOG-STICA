import { Card, Button } from "../ui";
import { usePackages } from "../../context/PackageContext";
import { useNavigate } from "react-router-dom";
import { PiTrashSimpleLight } from "react-icons/pi";
import { BiPencil } from "react-icons/bi";
import { MdDone } from "react-icons/md";
import { useEffect } from "react";

function PackageCard({ pack }) {
  const {
    deletePackage,
    markPackageAsDelivered,
    unmarkPackageAsDelivered,
    loadPackages,
  } = usePackages();

  const navigate = useNavigate();

  useEffect(() => {
    console.log("📦 Package received:", pack);
  }, [pack]);

  const handleMark = async () => {
    if (window.confirm("Mark as delivered?")) {
      await markPackageAsDelivered(pack.id);
      await loadPackages();
    }
  };

  const handleUnmark = async () => {
    if (window.confirm("Unmark as delivered?")) {
      await unmarkPackageAsDelivered(pack.id);
      await loadPackages();
    }
  };

  return (
    <Card
      key={pack.id}
      className={`bg-white p-4 sm:p-6 flex flex-col justify-between border-2 rounded-xl shadow-sm transition ${
        pack.delivered
          ? "border-green-500 bg-green-50"
          : "border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          {pack.name}
          {pack.delivered && (
            <span className="text-sm text-green-600 ml-2 font-semibold">
              (Delivered)
            </span>
          )}
        </h1>
        <p className="text-gray-600 text-sm sm:text-base">{pack.description}</p>
        <p className="text-gray-700 text-sm sm:text-base">
          <strong>Priority:</strong> {pack.priority}
        </p>
        <p className="text-gray-700 text-sm sm:text-base">
          <strong>Address:</strong> {pack.destinationaddress}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        {!pack.delivered ? (
          <Button
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            onClick={handleMark}
          >
            <MdDone className="mr-1" />
            Deliver
          </Button>
        ) : (
          <Button
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={handleUnmark}
          >
            <MdDone className="mr-1 rotate-180" />
            Unmark
          </Button>
        )}

        <Button
          className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => navigate(`/packages/${pack.id}/edit`)}
        >
          <BiPencil className="mr-1" />
          Edit
        </Button>

        <Button
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={async () => {
            if (window.confirm("Delete this package?")) {
              deletePackage(pack.id);
            }
          }}
        >
          <PiTrashSimpleLight className="mr-1" />
          Delete
        </Button>
      </div>
    </Card>
  );
}

export default PackageCard;
