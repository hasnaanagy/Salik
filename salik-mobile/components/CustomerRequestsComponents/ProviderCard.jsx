import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import CustomText from "../CustomeComponents/CustomText";

const { width, height } = Dimensions.get("window");

const ProviderCard = ({
  provider,
  isExpanded,
  toggleProviderExpanded,
  handleCallProvider,
  formatTime,
}) => {
  return (
    <View style={styles.providerCard}>
      <View style={styles.providerHeader}>
        <View style={styles.providerProfile}>
          <Image
            source={{ uri: provider.userId?.profileImg }}
            style={styles.providerImage}
            defaultSource={require("../../assets/adaptive-icon.png")}
          />
          <View style={styles.providerInfo}>
            <CustomText style={styles.providerName}>
              {provider.userId?.fullName || "Unknown"}
            </CustomText>
            <View style={styles.serviceTypeContainer}>
              <Feather
                name={provider.serviceType === "fuel" ? "droplet" : "tool"}
                size={14}
                color="#39322b"
                style={{ marginRight: 6 }}
              />
              <CustomText style={styles.serviceType}>
                {provider.serviceType
                  ? `${provider.serviceType} Service`
                  : "Service"}
              </CustomText>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.contactButton}
          onPress={() => handleCallProvider(provider.userId?.phone)}
        >
          <Feather
            name="phone"
            size={16}
            color="#000"
            style={styles.contactIcon}
          />
          <CustomText style={styles.contactText}>Call</CustomText>
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity
        style={[
          styles.availabilityContainer,
          {
            backgroundColor: isExpanded ? "#f8f9fa" : "transparent",
            borderRadius: 12,
            padding: 6,
          },
        ]}
        onPress={() => toggleProviderExpanded(provider._id)}
      >
        <Feather name="calendar" size={16} color="#6c757d" />
        <CustomText style={styles.availabilityText}>Available:</CustomText>
        {isExpanded ? (
          <View style={styles.expandedDaysContainer}>
            {(provider.workingDays || []).map((day, index) => (
              <View key={index} style={styles.dayBadge}>
                <CustomText style={styles.dayBadgeText}>{day}</CustomText>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.collapsedDaysContainer}>
            <CustomText style={styles.availabilityDays}>
              {(provider.workingDays || []).slice(0, 3).join(", ")}
              {(provider.workingDays || []).length > 3 &&
                ` +${(provider.workingDays || []).length - 3} more`}
            </CustomText>
            <Feather
              name="chevron-down"
              size={16}
              color="#6c757d"
              style={styles.expandIcon}
            />
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.workingHoursContainer}>
        <Feather
          name="clock"
          size={16}
          color="#6c757d"
          style={styles.hoursIcon}
        />
        <CustomText style={styles.workingHours}>
          Hours: {formatTime(provider.workingHours?.from)} -{" "}
          {formatTime(provider.workingHours?.to)}
        </CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  providerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: width * 0.04,
    marginVertical: height * 0.012,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  providerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.015,
  },
  providerProfile: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  providerImage: {
    width: width * 0.14,
    height: width * 0.14,
    borderRadius: width * 0.07,
    marginRight: width * 0.03,
    borderWidth: 2,
    borderColor: "#ffb800",
  },
  providerInfo: {
    justifyContent: "center",
    flex: 1,
  },
  providerName: {
    fontSize: width * 0.042,
    fontWeight: "bold",
    color: "#212529",
    marginBottom: 6,
  },
  serviceTypeContainer: {
    backgroundColor: "#FFF3E0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
  },
  serviceType: {
    fontSize: width * 0.032,
    color: "#F57C00",
    textTransform: "capitalize",
    fontWeight: "500",
  },
  contactButton: {
    backgroundColor: "#ffb800",
    paddingHorizontal: width * 0.035,
    paddingVertical: height * 0.012,
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  contactIcon: {
    marginRight: width * 0.01,
  },
  contactText: {
    color: "#000",
    fontSize: width * 0.035,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#e9ecef",
    marginVertical: height * 0.015,
    width: "100%",
  },
  availabilityContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: height * 0.012,
    paddingVertical: 6,
  },
  availabilityText: {
    fontSize: width * 0.035,
    color: "#495057",
    marginLeft: width * 0.02,
    marginRight: width * 0.01,
    fontWeight: "500",
  },
  collapsedDaysContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  availabilityDays: {
    fontSize: width * 0.035,
    color: "#6c757d",
  },
  expandedDaysContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 4,
  },
  dayBadge: {
    backgroundColor: "#e9ecef",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  dayBadgeText: {
    fontSize: width * 0.032,
    color: "#495057",
    fontWeight: "500",
  },
  expandIcon: {
    marginLeft: 4,
  },
  workingHoursContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  hoursIcon: {
    marginRight: width * 0.02,
    color: "#6c757d",
  },
  workingHours: {
    fontSize: width * 0.035,
    color: "#495057",
    fontWeight: "500",
  },
});

export default ProviderCard;
