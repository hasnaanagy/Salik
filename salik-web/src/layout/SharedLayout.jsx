import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/Sharedcomponent/Header";
import { Footer } from "../components/Sharedcomponent/Footer";
import { Box } from "@mui/material";

export function SharedLayout() {
  return (
    <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh", // Full viewport height
    }}
  >
      <Header></Header>
      <div style={{ margin:"20px"}}>
      <Outlet></Outlet>
      </div>
      <Footer></Footer>
</Box>    

  );
}
