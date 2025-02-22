import React from "react";
import { RideSearch } from "../components/RideSearchHome/RideSearch";
import ServicesHome from "../components/ServicesComponent/ServicesHome";
import { IntoScreen } from "../components/ServicesComponent/IntoScreen";

export default function Home() {
  return (
    <>
      <RideSearch />
      <ServicesHome />
      <IntoScreen />
    </>
  );
}
