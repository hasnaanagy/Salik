import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Sharedcomponent/Header";
import { Footer } from "../components/Sharedcomponent/Footer";

export function SharedLayout() {
  return (
    <div>
      <Header></Header>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
}
