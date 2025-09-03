import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoutes } from "../../context/RoutesContext";
import { GOOGLE_MAPS_API_KEY } from "../../../config";

const NavigationRoute = () => {
  const { routeId } = useParams();
  const { getRoutePackages, getRouteName } = useRoutes();
  const [routePackages, setRoutePackages] = useState([]);
  const [routeName, setRouteName] = useState(""); 
  const [userLocation, setUserLocation] = useState({ lat: 40.4167, lng: -3.70325 });
  const [showPackages, setShowPackages] = useState(false);
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const [optimizedAddresses, setOptimizedAddresses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packages = await getRoutePackages(routeId);
        setRoutePackages(packages);

        const name = await getRouteName(routeId);
        setRouteName(name);
      } catch (error) {
        console.error("Error loading route data:", error);
      }
    };
    fetchData();
  }, [routeId]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=directions`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      }
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: userLocation,
      });

      new window.google.maps.Marker({
        position: userLocation,
        map: map,
        title: "Your location",
      });

      if (routePackages.length > 0) {
        const waypoints = routePackages.map((pkg) => ({
          location: new window.google.maps.LatLng(pkg.latitude, pkg.longitude),
          stopover: true,
        }));

        const directionsService = new window.google.maps.DirectionsService();
        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          map: map,
          preserveViewport: true,
        });

        const request = {
          origin: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
          destination: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
          waypoints: waypoints,
          travelMode: window.google.maps.TravelMode.DRIVING,
          optimizeWaypoints: true,
        };

        directionsService.route(request, (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(result);
            const orderedCoords = result.routes[0].waypoint_order.map(index => {
              const pkg = routePackages[index];
              return `${pkg.latitude},${pkg.longitude}`;
            });
            setOptimizedAddresses(orderedCoords);
          } else {
            console.error("Error retrieving route:", status);
          }
        });
      }
    };

    loadGoogleMaps();
  }, [userLocation, routePackages]);

  const openGoogleMaps = () => {
    if (optimizedAddresses.length === 0) return;
    const destination = optimizedAddresses[optimizedAddresses.length - 1];
    const waypoints = optimizedAddresses.slice(0, -1).join('|');
    const origin = 'My+Location';

    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving&waypoints=${waypoints}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 text-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Route: {routeName} — You must deliver {routePackages.length} package{routePackages.length !== 1 ? 's' : ''}
        </h1>

        <div ref={mapRef} className="w-full h-[500px] md:h-[700px] lg:h-[850px] rounded-lg border border-gray-300 shadow-sm" />

        <div className="flex flex-wrap justify-center gap-4 mt-6">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg"
            onClick={() => navigate(`/navigation-live/${routeId}`)}
          >
            Navigate
          </button>
          <button
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg"
            onClick={() => setShowPackages(!showPackages)}
          >
            {showPackages ? "Hide Packages" : "View Packages"}
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg"
            onClick={() => navigate(`/routes/${routeId}/edit`)}
          >
            ➕ Add Packages
          </button>
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg"
            onClick={openGoogleMaps}
          >
            Open in Google Maps
          </button>
        </div>

        {showPackages && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow border border-gray-200">
            <h2 className="text-xl font-bold mb-3">📦 Package List</h2>
            {routePackages.length > 0 ? (
              <ul className="list-disc pl-6 space-y-1">
                {routePackages.map((pkg) => (
                  <li key={pkg.id}>
                    {pkg.name} — {pkg.destinationaddress}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No packages in this route.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationRoute;
