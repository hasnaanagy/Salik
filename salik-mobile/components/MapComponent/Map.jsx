import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Platform, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setFromLocation, setToLocation } from "../../redux/slices/locationSlice";
import appColors from "../../constants/colors.js";

const Map = ({ onLocationSelect, style }) => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState("");
  const dispatch = useDispatch();
  const { focusedInput } = useSelector((state) => state.location);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      const userCoords = userLocation.coords;

      setLocation(userCoords);
      setRegion({
        latitude: userCoords.latitude,
        longitude: userCoords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      fetchAddress(userCoords.latitude, userCoords.longitude);
    })();
  }, []);

  const centerMap = async () => {
    let updatedLocation = await Location.getCurrentPositionAsync({});
    const newCoords = updatedLocation.coords;

    setLocation(newCoords);

    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: {
            latitude: newCoords.latitude,
            longitude: newCoords.longitude,
          },
          altitude: 500,
        },
        { duration: 1000 }
      );
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      let addressArray = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addressArray.length > 0) {
        const formattedAddress = `${addressArray[0].name || ""}, ${addressArray[0].city || ""}`;
        setAddress(formattedAddress);

        // Update Redux state only if onLocationSelect is not provided (i.e., in search screen)
        if (!onLocationSelect && focusedInput) {
          if (focusedInput === "fromLocation") {
            dispatch(setFromLocation(formattedAddress));
          } else if (focusedInput === "toLocation") {
            dispatch(setToLocation(formattedAddress));
          }
        }
      }
    } catch (error) {
      console.log("Error fetching address:", error);
    }
  };

  useEffect(() => {
    if (region) {
      fetchAddress(region.latitude, region.longitude);
    }
  }, [region]);

  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitude,
      longitude,
    }));
  };

  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitude,
      longitude,
    }));
  };

  const handleConfirmLocation = () => {
    if (address && onLocationSelect) {
      onLocationSelect(address);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={setRegion}
          showsUserLocation={Platform.OS === "ios" ? false : true}
          onPress={handleMapPress}
        >
          <Marker
            coordinate={{
              latitude: region.latitude,
              longitude: region.longitude,
            }}
            draggable
            onDragEnd={handleMarkerDragEnd}
          />
        </MapView>
      )}

      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>
          {address || (onLocationSelect ? "Select a location on the map..." : "Fetching address...")}
        </Text>
        {onLocationSelect && address && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirmLocation}
          >
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </TouchableOpacity>
        )}
      </View>

      {Platform.OS === "ios" && (
        <TouchableOpacity style={styles.myLocationButton} onPress={centerMap}>
          <FontAwesome name="location-arrow" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  addressContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    alignItems: "center",
  },
  addressText: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  confirmButton: {
    backgroundColor: appColors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  myLocationButton: {
    position: "absolute",
    top: 60,
    right: 20,
    backgroundColor: "black",
    padding: 12,
    borderRadius: 50,
    elevation: 5,
  },
});

export default Map;