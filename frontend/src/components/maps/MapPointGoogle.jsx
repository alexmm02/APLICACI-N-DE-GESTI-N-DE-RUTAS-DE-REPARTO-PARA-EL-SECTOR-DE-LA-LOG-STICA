import { useEffect, useRef } from "react";
import { GOOGLE_MAPS_API_KEY } from "../../../config";

const MapPointGoogle = ({ packages }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google && window.google.maps) {
        initMap();
      } else {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      }
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: { lat: 40.4167, lng: -3.70325 }, // Madrid
      });

      packages.forEach((pkg) => {
        const lat = parseFloat(pkg.latitude);
        const lng = parseFloat(pkg.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          new window.google.maps.Marker({
            position: { lat, lng },
            map: map,
          });
        } else {
          console.error("Error: Latitud o longitud inválida", pkg);
        }
      });
    };

    loadGoogleMaps();
  }, [packages]);

  return <div ref={mapRef} style={{ width: "100%", height: "500px" }}></div>;
};

export default MapPointGoogle;
