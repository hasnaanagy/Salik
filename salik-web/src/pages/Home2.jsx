import React, { useRef, useState } from "react";
import SliderComponent from "../components/HomeComponents/SliderComponent";
import TextComponent from "../components/HomeComponents/TextComponents";
import ServicesSection from "../components/HomeComponents/SerivcesSection";
import ValuesSection from "../components/HomeComponents/ValuesSection";
import SafetySection from "../components/HomeComponents/SafetySection";
import ImpactSection from "../components/HomeComponents/ImpactSection";

export default function Home2() {
  return (
    <>
      <SliderComponent />
      <TextComponent />
      <ServicesSection />
      <ValuesSection />
      <SafetySection />
      <ImpactSection />
    </>
  );
}
