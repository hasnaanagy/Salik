import React from "react";
import { RideSearch } from "../components/RideSearchHome/RideSearch";
import RidesList from "../components/RideSearchHome/RidesList";

export default function Home() {
  return (
    <>
      <RideSearch />
      <RidesList />
    </>
  );
}
