import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Button } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";

function LocationMarker({ position, setPosition, onLocationSelect }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const newLocation = e.latlng;
      setPosition(newLocation);
      map.flyTo(newLocation, 14, { animate: true });
      // Pass the location to the parent component
      if (onLocationSelect) {
        reverseGeocode(newLocation.lat, newLocation.lng, onLocationSelect);
      }
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { animate: true });
    }
  }, [position, map]);

  return position ? (
    <Marker position={position}>
      <Popup>
        Selected Location: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
      </Popup>
    </Marker>
  ) : null;
}

const reverseGeocode = async (lat, lng, onLocationSelect) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    const data = await response.json();

    if (data.display_name) {
      onLocationSelect(lat, lng, data.display_name);
    }
  } catch (error) {
    console.error("Error fetching address:", error);
  }
};

export default function MapComponent({
  onLocationSelect,
  pickupCoords,
  focusedInput,
}) {
  const [position, setPosition] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (pickupCoords && map) {
      setPosition(pickupCoords);
      map.flyTo([pickupCoords.lat, pickupCoords.lng], 14, { animate: true });
    }
  }, [pickupCoords, map]);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(userLocation);
          if (map) {
            map.flyTo(userLocation, 14, { animate: true });
          }
          reverseGeocode(userLocation.lat, userLocation.lng, onLocationSelect);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  };

  const handleSetLocation = () => {
    if (position) {
      reverseGeocode(position.lat, position.lng, onLocationSelect); // Updates the focused input
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <MapContainer
        center={position || [30.0444, 31.2357]} // Default: Cairo
        zoom={12}
        style={{ height: "400px", width: "100%", position: "absolute" }}
        whenCreated={setMap}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
      <Button
        variant="contained"
        onClick={getCurrentLocation}
        style={{
          position: "absolute",
          backgroundColor: "#ffb800",
          color: "black",
          zIndex: 1000,
          right: "10px",
          top: "10px",
          borderRadius: "10%",
          width: "50px",
          height: "50px",
        }}
      >
        <MyLocationIcon style={{ fontSize: "30px" }} />
      </Button>
    </div>
  );
}
