import React from "react";
import { RideSearch } from "../components/RideSearchHome/RideSearch";
import ServicesHome from "../components/ServicesComponent/ServicesHome";
import { IntoScreen } from "../components/ServicesComponent/IntoScreen";
import { useSelector } from "react-redux";

export default function Home() {
  const { user } = useSelector((state) => state.auth);

  console.log(user?.type); // Avoid crashing if user is undefined

  if (!user) {
    return (
      <>
        <IntoScreen />
      </>
    ); // Handle cases where user is not yet available
  }

  return (
    <>
      {user.type === "provider" && (
        <>
          <ServicesHome />
          <IntoScreen />
        </>
      )}
      {user.type === "customer" && (
        <>
          <RideSearch />
          <IntoScreen />
        </>
      )}
    </>
  );
}
