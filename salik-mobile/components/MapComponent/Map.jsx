import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Platform, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { setFromLocation, setToLocation } from "../../redux/slices/locationSlice";

const Map = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState(""); // تخزين العنوان
  const dispatch = useDispatch(); // لاستخدام Redux
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

  // دالة لتحويل الإحداثيات إلى عنوان
  const fetchAddress = async (latitude, longitude) => {
    try {
      let addressArray = await Location.reverseGeocodeAsync({ latitude, longitude });
      if (addressArray.length > 0) {
        const formattedAddress = `${addressArray[0].name}, ${addressArray[0].city}`;
        console.log(formattedAddress)
        if (focusedInput == "fromLocation") {
          dispatch(setFromLocation(formattedAddress));
        } else {
          dispatch(setToLocation(formattedAddress));
        }
        setAddress(formattedAddress); // Update the address state
      }
    } catch (error) {
      console.log("Error fetching address:", error);
    }
  };

  // استدعاء `fetchAddress` عند تغيير `region`
  useEffect(() => {
    if (region) {
      fetchAddress(region.latitude, region.longitude);
    }
  }, [region]);

  // تحديث الموقع عند تحريك الماركر
  const handleMarkerDragEnd = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitude,
      longitude,
    }));
  };

  // تحديث الموقع عند الضغط على الخريطة
  const handleMapPress = (e) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    setRegion((prevRegion) => ({
      ...prevRegion,
      latitude,
      longitude,
    }));
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={setRegion} // استدعاء عند انتهاء التحريك فقط
          showsUserLocation={Platform.OS === "ios" ? false : true}
          onPress={handleMapPress} // استدعاء عند الضغط على الخريطة
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

      {/* عرض العنوان على الشاشة */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressText}>{address || "جاري جلب العنوان..."}</Text>
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
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
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
  addressText: { fontSize: 16, fontWeight: "bold" },
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