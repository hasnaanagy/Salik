import React from "react";
import { RideSearch } from "../components/RideSearchHome/RideSearch";
import ServicesHome from "../components/ServicesComponent/ServicesHome";
import { IntoScreen } from "../components/ServicesComponent/IntoScreen";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return (
      <>
        <RideSearch />
        <ServicesHome />
        <IntoScreen />
      </>
    );
  }

  return (
    <>
      {user.type === "provider" ? (
        <>
          <ServicesHome />
          <IntoScreen />
        </>
      ) : (
        <>
          <RideSearch />
          <IntoScreen />
        </>
      )}
    </>
  );
}
