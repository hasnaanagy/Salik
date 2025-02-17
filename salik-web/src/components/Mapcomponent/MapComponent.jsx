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

function LocationMarker({ position, setPosition, onLocationSelect }) {
  const map = useMap();

  useMapEvents({
    click(e) {
      const newLocation = e.latlng;
      setPosition(newLocation);
      map.flyTo(newLocation, 14, { animate: true }); // الخريطة تتحرك تلقائيًا
      reverseGeocode(newLocation.lat, newLocation.lng, onLocationSelect);
    },
  });

  useEffect(() => {
    if (position) {
      map.flyTo(position, 14, { animate: true }); // تحريك الخريطة تلقائيًا
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

// Reverse Geocode Function
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

export default function MapComponent({ onLocationSelect, pickupCoords }) {
  const [position, setPosition] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (pickupCoords && map) {
      setPosition(pickupCoords);
      map.flyTo([pickupCoords.lat, pickupCoords.lng], 14, { animate: true }); // حركة سلسة للخريطة
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
            map.flyTo(userLocation, 14, { animate: true }); // حركة الخريطة تلقائيًا
          }
          reverseGeocode(userLocation.lat, userLocation.lng, onLocationSelect);
        },
        (error) => {
          console.error("Error fetching location:", error);
        }
      );
    }
  };

  return (
    <div>
      <MapContainer
        center={position || [30.0444, 31.2357]} // القاهرة كموقع افتراضي
        zoom={12}
        style={{ height: "400px", width: "100%" }}
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
          marginTop: "10px",
          backgroundColor: "#ffb800",
          color: "black",
        }}
      >
        Set My Location
      </Button>
         
    </div>
  );
}
