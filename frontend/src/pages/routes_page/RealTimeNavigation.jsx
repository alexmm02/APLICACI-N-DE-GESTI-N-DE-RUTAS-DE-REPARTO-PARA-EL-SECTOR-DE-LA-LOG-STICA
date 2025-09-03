import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useRoutes } from "../../context/RoutesContext";
import { GOOGLE_MAPS_API_KEY } from "../../../config";

const RealTimeNavigation = () => {
  const { routeId } = useParams();
  const { getRoutePackages } = useRoutes();
  const [routePackages, setRoutePackages] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const packages = await getRoutePackages(routeId);
        setRoutePackages(packages);
      } catch (error) {
        console.error("Error fetching route packages:", error);
      }
    };
    fetchPackages();
  }, [routeId, getRoutePackages]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true, maximumAge: 0 }
      );
    }
  }, []);

  useEffect(() => {
    if (!userLocation) return;

    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      }
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 17,
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
          suppressMarkers: false,
          preserveViewport: true,
        });

        directionsService.route(
          {
            origin: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
            destination: waypoints[waypoints.length - 1].location,
            waypoints: waypoints.slice(0, -1),
            travelMode: window.google.maps.TravelMode.DRIVING,
            optimizeWaypoints: true,
          },
          (result, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
              directionsRenderer.setDirections(result);
            } else {
              console.error("Error getting route:", status);
            }
          }
        );
      }
    };

    loadGoogleMaps();
  }, [userLocation, routePackages]);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 text-gray-800 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-6">🧭 Real-Time Navigation</h1>

        <div ref={mapRef} className="w-full h-[500px] md:h-[700px] lg:h-[850px] rounded-lg border border-gray-300 shadow-sm" />

        <div className="flex justify-center gap-4 mt-6">
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-6 rounded-lg"
            onClick={() => navigate(-1)}
          >
            Exit Navigation
          </button>
        </div>
      </div>
    </div>
  );
};

export default RealTimeNavigation;
