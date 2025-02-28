import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Sharedcomponent/Header";
import { Footer } from "../components/Sharedcomponent/Footer";
import { Box, Button } from "@mui/material";

export function SharedLayout() {

  return (

    <>
    <Header />
    <div style={{ margin: "20px" }}>
      <Outlet />
    </div>
    <Footer />
    </>
  );
}
