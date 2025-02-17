import { useState, useEffect } from "react";
import { useMapEvents } from "react-leaflet";

export function useLocationMarker() {
  const [position, setPosition] = useState(null);

  // Function to set the marker on user’s current location
  const setCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  };

  useMapEvents({
    click(e) {
      setPosition(e.latlng); // Set marker on click
    },
  });

  return { position, setCurrentLocation };
}
