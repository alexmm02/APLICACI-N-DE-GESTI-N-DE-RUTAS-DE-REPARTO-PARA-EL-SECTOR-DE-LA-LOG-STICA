import {
  Card,
  Input,
  Textarea,
  Label,
  Button,
} from "../../components/ui";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { usePackages } from "../../context/PackageContext";
import { GOOGLE_MAPS_API_KEY } from "../../../config";

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

function PackageFormPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();
  const { createPackage, updatePackage, loadPackage, errors: packageErrors } = usePackages();
  const params = useParams();

  const destinationRef = useRef(null);
  const autocompleteSessionToken = useRef(null);
  const [isPlaceSelected, setIsPlaceSelected] = useState(false);

  const onSubmit = handleSubmit(async (data) => {
    if (!isPlaceSelected) {
      setError("destinationAddress", {
        type: "manual",
        message: "You must select a valid address from the suggestions.",
      });
      return;
    }

    data.priority = parseInt(data.priority, 10);
    try {
      let pack;
      if (!params.id) {
        pack = await createPackage(data);
      } else {
        pack = await updatePackage(params.id, data);
      }
      if (pack) {
        navigate("/packages");
      }
    } catch (error) {
      console.error("Error creating/updating package:", error);
    }
  });

  useEffect(() => {
    if (params.id) {
      loadPackage(params.id)
        .then((pack) => {
          if (pack) {
            setValue("name", pack.name);
            setValue("description", pack.description);
            setValue("priority", pack.priority);
            setValue("destinationAddress", pack.destinationaddress);
            setIsPlaceSelected(true);
          }
        })
        .catch((error) => {
          console.error("Error loading package:", error);
        });
    }
  }, [params.id, setValue]);

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
              setValue("destinationAddress", place.formatted_address);
              setIsPlaceSelected(true);
              clearErrors("destinationAddress");
            }
          });
        }
      } catch (error) {
        console.error("Error loading Google Maps script:", error);
      }
    };

    initAutocomplete();
  }, [setValue, clearErrors]);

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-5rem)] px-4 py-8 text-gray-800">
      <div className="w-full max-w-xl mx-auto">
        <Card className="w-full max-w-xl">
          {packageErrors?.length > 0 && (
            <div className="mb-4">
              {packageErrors.map((error, i) => (
                <p className="text-red-500 text-sm" key={i}>
                  {error}
                </p>
              ))}
            </div>
          )}

          <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
            {params.id ? "Edit Package" : "Create Package"}
          </h2>

          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                type="text"
                placeholder="Package name"
                autoFocus
                {...register("name", { required: "Name is required" })}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                placeholder="Description"
                rows={3}
                {...register("description")}
              />
            </div>

            <div>
              <Label htmlFor="priority">Priority (0-10)</Label>
              <Input
                type="number"
                placeholder="Priority"
                {...register("priority", {
                  required: "Priority is required",
                  min: { value: 0, message: "Minimum priority is 0" },
                  max: { value: 10, message: "Maximum priority is 10" },
                  valueAsNumber: true,
                })}
              />
              {errors.priority && (
                <p className="text-red-500 text-sm">{errors.priority.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="destinationAddress">Destination Address</Label>
              <Input
                type="text"
                placeholder="Select an address"
                {...register("destinationAddress", {
                  required: "Destination address is required",
                })}
                ref={(e) => {
                  register("destinationAddress").ref(e);
                  destinationRef.current = e;
                }}
                onChange={() => setIsPlaceSelected(false)}
              />
              {errors.destinationAddress && (
                <p className="text-red-500 text-sm">{errors.destinationAddress.message}</p>
              )}
            </div>

            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              {params.id ? "Save Changes" : "Create Package"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}

export default PackageFormPage;
