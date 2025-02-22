import React from "react";
import { IntoScreen } from "./IntoScreen";

export function IntoImage() {
  const sections = [
    {
      image: "../../../public/images/road 2 (1).jpg",
      title: "Your All-in-One Place",
      description:
        "Car sharing, courier services, and roadside assistance—everything in one place!",
    },
    {
      image:
        "../../../public/images/man-with-map-smartphone-renting-car-driver-using-car-sharing-app--searching-vehicle-vector-illustration-transport-transportation-urban-traf.jpg",
      title: " Car Sharing & Rides",
      description:
        "Ride or Share a Car need a ride? Book one instantly.Own a car?Share it and earn money.",
      reverse: true,
    },
    {
      image: "../../../public/images/maintanance 1 (1).jpg",

      title: "Emergency Help",
      description:
        " Roadside Assistance, Fuel delivery, towing, and mechanic support—whenever you need it.",
    },
    {
      image: "../../../public/images/undraw_welcome_nk8k.png",

      title: "Join Salik!",
      description:
        "How Do You Want to Join? As a Customer – Book rides, send packages, or get roadside help.As a Provider – Offer rides, deliver packages, or provide assistance.",
      reverse: true,
    },
  ];

  return <IntoScreen sections={sections} />;
}
