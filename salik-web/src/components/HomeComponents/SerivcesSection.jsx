import React from "react";
import "../../styles/ServicesSection.css";

const ServicesSection = () => {
  const services = [
    {
      title: "City rides",
      description:
        "Choose your ride, get a fair deal for passengers and drivers",
      buttons: ["Passengers", "Drivers"],
    },
    {
      title: "City to City",
      description:
        "Comfort to city or other cities: on your schedule and for a fair fare",
      buttons: ["Passengers", "Drivers"],
    },
    {
      title: "Courier delivery",
      description: "Express courier delivery for individuals and businesses",
      buttons: ["Clients", "Couriers", "Food Business"],
    },
    {
      title: "Freight delivery",
      description: "Transporting and tracking cargo for people and companies",
      buttons: ["Clients", "Drivers", "Food Business"],
    },
    {
      title: "Credit Products",
      description:
        "Providing access to fair and transparent financial services to the inDrive community",
      buttons: ["Drivers"],
    },
  ];

  return (
    <section className="services-section">
      <div className="green-overlay"></div>
      <div className="section-content">
        <h1 className="section-title">One app, many services</h1>
        <div className="services-grid">
          {services.map((service, index) => (
            <div key={index} className="service-card">
              <div className="card-icon">📦</div> {/* Placeholder icon */}
              <h2 className="card-title">{service.title}</h2>
              <p className="card-description">{service.description}</p>
              <div className="card-buttons">
                {service.buttons.map((button, btnIndex) => (
                  <button key={btnIndex} className="card-button">
                    {button}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
