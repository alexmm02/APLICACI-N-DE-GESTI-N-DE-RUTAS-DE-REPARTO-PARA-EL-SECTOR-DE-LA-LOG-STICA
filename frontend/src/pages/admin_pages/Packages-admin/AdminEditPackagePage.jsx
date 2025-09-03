import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAdminPackages } from "../../../context/adminContext/AdminPackageContext";
import { Button, Input, Label, Card, Textarea } from "../../../components/ui";
import { GOOGLE_MAPS_API_KEY } from "../../../../config";

function loadGoogleMapsScript(apiKey) {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

function EditPackagePage() {
  const { id, userId } = useParams();
  const navigate = useNavigate();
  const { getPackageById, createPackage, updatePackage } = useAdminPackages();

  const [packageData, setPackageData] = useState({
    name: "",
    description: "",
    destinationAddress: "",
    priority: 5,
    user_id: userId || "",
  });

  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState(null);
  const destinationRef = useRef(null);
  const autocompleteSessionToken = useRef(null);

  useEffect(() => {
    if (!id) return;

    const fetchPackage = async () => {
      try {
        const data = await getPackageById(id);
        setPackageData({
          ...data,
          description: data.description || "",
          destinationAddress: data.destinationaddress || "",
        });
      } catch (err) {
        setError("Error loading package");
      } finally {
        setLoading(false);
      }
    };

    fetchPackage();
  }, [id, getPackageById]);

  useEffect(() => {
    const initAutocomplete = async () => {
      try {
        await loadGoogleMapsScript(GOOGLE_MAPS_API_KEY);

        if (window.google && destinationRef.current) {
          autocompleteSessionToken.current = new window.google.maps.places.AutocompleteSessionToken();

          const autocomplete = new window.google.maps.places.Autocomplete(destinationRef.current, {
            types: ["geocode"],
            componentRestrictions: { country: "es" },
            fields: ["formatted_address", "geometry", "place_id"],
          });

          autocomplete.setOptions({ sessionToken: autocompleteSessionToken.current });

          autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (place && place.formatted_address) {
              setPackageData((prev) => ({ ...prev, destinationAddress: place.formatted_address }));
            }
          });
        }
      } catch (error) {
        console.error("Error loading Google Maps:", error);
      }
    };

    initAutocomplete();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPackageData((prevData) => ({
      ...prevData,
      [name]: name === "priority" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updatePackage(id, packageData);
        navigate("/admin-dashboard/packages");
      } else {
        await createPackage(userId, packageData);
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      setError("Error saving package");
    }
  };

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-10 text-gray-800">
      <div className="w-full max-w-lg mx-auto">
        <Card>
          <h1 className="text-3xl font-bold text-center mb-6">
            {id ? "✏️ Edit Package" : "📦 Create Package"}
          </h1>

          {loading ? (
            <p className="text-center text-gray-600">Loading package...</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  name="name"
                  value={packageData.name || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  name="description"
                  rows={3}
                  value={packageData.description || ""}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor="destinationAddress">Destination Address</Label>
                <Input
                  type="text"
                  name="destinationAddress"
                  value={packageData.destinationAddress || ""}
                  onChange={handleChange}
                  ref={destinationRef}
                />
              </div>

              <div>
                <Label htmlFor="priority">Priority</Label>
                <select
                  name="priority"
                  value={packageData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {[...Array(11).keys()].map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>

              {id && (
                <div>
                  <Label htmlFor="user_id">User</Label>
                  <Input
                    type="text"
                    name="user_id"
                    value={packageData.user_id || ""}
                    onChange={handleChange}
                  />
                </div>
              )}

              {error && <p className="text-red-500 text-center">{error}</p>}

              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                  onClick={() => navigate(id ? "/admin-dashboard/packages" : -1)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {id ? "Save Changes" : "Create Package"}
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}

export default EditPackagePage;
