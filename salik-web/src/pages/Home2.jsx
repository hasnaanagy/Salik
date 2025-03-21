import React, { useRef, useState } from "react";
import SliderComponent from "../components/HomeComponents/SliderComponent";
import TextComponent from "../components/HomeComponents/TextComponents";
import ServicesSection from "../components/HomeComponents/SerivcesSection";

export default function Home2() {
  return (
    <>
      <SliderComponent />
      <TextComponent />
      <ServicesSection />
    </>
  );
}
