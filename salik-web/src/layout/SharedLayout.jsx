import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Sharedcomponent/Header";
import { Footer } from "../components/Sharedcomponent/Footer";

export function SharedLayout() {
  const location = useLocation();

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}
