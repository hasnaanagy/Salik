import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import CustomText from "../CustomeComponents/CustomText";
import {
  getProviderServices,
  deleteService,
} from "../../redux/slices/ServiceSlice";
import BackButton from "../SevicesComponents/BackButton";

const { width, height } = Dimensions.get("window");

function ServicesProvider() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { service, loading, error } = useSelector((state) => state.service);
  const [expandedCards, setExpandedCards] = useState([]);

  useEffect(() => {
    dispatch(getProviderServices());
  }, [dispatch]);

  const handleDelete = (serviceId) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await dispatch(deleteService(serviceId));
            await dispatch(getProviderServices());
          },
        },
      ]
    );
  };

  const handleEdit = (item) => {
    Alert.alert(
      "Edit Service",
      `Do you want to edit the ${item.serviceType} service?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Edit",
          onPress: () => {

            let fromTime = item.workingHours?.from || "";
            let toTime = item.workingHours?.to || "";

            if (fromTime.includes("T")) {
              fromTime = new Date(fromTime).toISOString();
            }

            if (toTime.includes("T")) {
              toTime = new Date(toTime).toISOString();
            }

            router.push({
              pathname: "/addService",
              params: {
                mode: "edit",
                serviceId: item._id,
                serviceType: item.serviceType,
                location: item.addressOnly || "",
                workingDays: JSON.stringify(item.workingDays),
                workingHoursFrom: fromTime,
                workingHoursTo: toTime,
              },
            });
          },
        },
      ]
    );
  };

  const toggleCardExpansion = (serviceId) => {
    setExpandedCards((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      if (timeString.includes("T")) {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      }
      const [hours, minutes] = timeString.split(":");
      return `${hours}:${minutes}`;
    } catch (error) {
      return timeString;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f5c518" />
      </View>
    );
  }

  if (error || !service?.services?.length) {
    return (
      <View style={styles.noServicesContainer}>
        <BackButton  />
        <CustomText style={styles.noServicesText}>
          You have no services yet
        </CustomText>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <CustomText style={styles.headerTitle}>My Services</CustomText>
        </View>

        {service?.services?.map((item) => (
          <View key={item._id} style={styles.card}>
            <TouchableOpacity
              style={styles.cardHeader}
              onPress={() => toggleCardExpansion(item._id)}
            >
              <View style={styles.serviceTypeContainer}>
                <Feather
                  name={item.serviceType === "fuel" ? "droplet" : "tool"}
                  size={24}
                  color="#f5c518"
                />
                <CustomText style={styles.serviceType}>
                  {item.serviceType.charAt(0).toUpperCase() +
                    item.serviceType.slice(1)}{" "}
                  Service
                </CustomText>
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: "#e3f2fd" }]}
                  onPress={() => handleEdit(item)}
                >
                  <Feather name="edit-2" size={18} color="#2196f3" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.iconButton, { backgroundColor: "#ffebee" }]}
                  onPress={() => handleDelete(item._id)}
                >
                  <Feather name="trash-2" size={18} color="#f44336" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>

            {expandedCards.includes(item._id) && (
              <View style={styles.cardContent}>
                <View style={styles.infoRow}>
                  <Feather name="map-pin" size={16} color="#ffc107" />
                  <CustomText style={styles.infoText}>
                    {item.addressOnly ||
                      (item.location?.coordinates?.length
                        ? `${item.location.coordinates[0]}, ${item.location.coordinates[1]}`
                        : "Location not available")}
                  </CustomText>
                </View>

                <View style={styles.infoRow}>
                  <Feather name="clock" size={16} color="#ffc107" />
                  <CustomText style={styles.infoText}>
                    {`${formatTime(item.workingHours?.from)} - ${formatTime(
                      item.workingHours?.to
                    )}`}
                  </CustomText>
                </View>

                <View style={styles.infoRow}>
                  <Feather name="calendar" size={16} color="#ffc107" />
                  <View style={styles.daysContainer}>
                    {item.workingDays?.map((day, index) => (
                      <View key={index} style={styles.dayBadge}>
                        <CustomText style={styles.dayText}>{day}</CustomText>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 16,
    marginTop: Platform.OS === "ios" ? 50 : 0, 

  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noServicesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
        marginTop: Platform.OS === "ios" ? 50 : 0, 

  },
  noServicesText: {
    fontSize: 18,
    color: "#666",
    textAlign: "center",
  },
  header: {
    marginTop: Platform.OS === "ios" ? 10 : 10, // Increased top margin to make room for back button
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#212529",
    marginLeft: 10, // Adjust spacing between BackButton and title
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  serviceType: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
    color: "#212529",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
  },
  cardContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    color: "#495057",
    fontSize: 14,
  },
  daysContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  dayBadge: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dayText: {
    fontSize: 12,
    color: "#495057",
  },
});

export default ServicesProvider;
