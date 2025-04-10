import React from "react";
import "../../styles/ServicesSection.css";
import { motion } from "framer-motion";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import BuildIcon from "@mui/icons-material/Build";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import PublicIcon from "@mui/icons-material/Public";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";

const ServicesSection = () => {
  const services = [
    {
      title: "Car Sharing",
      description:
        "Affordable rides with trusted drivers. Share your journey, save money, and reduce traffic.",
      buttons: ["Book a Ride", "Become a Driver"],
      image: "../../../public/images/26388482_7184949.jpg",
      icon: <DirectionsCarIcon fontSize="large" />,
      color: "#4CAF50",
    },
    {
      title: "Emergency Mechanic",
      description:
        "24/7 roadside assistance for breakdowns, flat tires, and other emergencies. Help is just a tap away.",
      buttons: ["Request Help", "View Services"],
      image: "../../../public/images/26388482_7184949.jpg",
      icon: <BuildIcon fontSize="large" />,
      color: "#F44336",
    },
    {
      title: "Fuel Delivery",
      description:
        "Run out of gas? We'll deliver fuel directly to your location, so you can get back on the road quickly.",
      buttons: ["Order Fuel", "Learn More"],
      image: "../../../public/images/26388482_7184949.jpg",
      icon: <LocalGasStationIcon fontSize="large" />,
      color: "#FFC107",
    },
    {
      title: "City to City Travel",
      description:
        "Long-distance rides between cities with comfort and convenience at competitive prices.",
      buttons: ["Plan Trip", "Offer Rides"],
      image: "../../../public/images/26388482_7184949.jpg",
      icon: <PublicIcon fontSize="large" />,
      color: "#2196F3",
    },
    {
      title: "Delivery Services",
      description:
        "Fast and reliable delivery for packages, food, and other items across the city.",
      buttons: ["Send Package", "Track Order"],
      image: "../../../public/images/26388482_7184949.jpg",
      icon: <LocalShippingIcon fontSize="large" />,
      color: "#9C27B0",
    },
  ];

  return (
    <section className="services-section">
      <div className="services-background"></div>
      <div className="section-content">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="section-badge">Salik App</span>
          <h1 className="section-title">
            One App,
            <span className="highlight" style={{ color: "black" }}>
              Many
            </span>{" "}
            Services
          </h1>
          <p className="section-description">
            From car sharing to emergency mechanics and fuel delivery - Salik
            has you covered for all your transportation needs
          </p>
        </motion.div>

        <div className="services-grid">
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="service-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                y: -10,
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              }}
            >
              <div
                className="card-icon"
                style={{
                  backgroundColor: `${service.color}20`,
                  color: service.color,
                }}
              >
                {service.icon}
              </div>
              <h2 className="card-title">{service.title}</h2>
              <p className="card-description">{service.description}</p>
              <div className="card-buttons">
                {service.buttons.map((button, btnIndex) => (
                  <button
                    key={btnIndex}
                    className="card-button"
                    style={{
                      borderColor:
                        btnIndex === 0 ? service.color : "transparent",
                      backgroundColor:
                        btnIndex === 0 ? service.color : "transparent",
                      color: btnIndex === 0 ? "white" : service.color,
                    }}
                  >
                    {button}
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
