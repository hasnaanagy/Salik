import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "../components/Sharedcomponent/Header";
import { Footer } from "../components/Sharedcomponent/Footer";
import { Box, Button } from "@mui/material";

export function SharedLayout() {
  const location = useLocation();
  const hideHeaderRoutes = ["/login", "/signup"];
  const hideFooterRoutes = ["/login", "/signup", "/editProfile"];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);
  const showFooter = !hideFooterRoutes.includes(location.pathname);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      {showHeader && <Header />}
      <div style={{ margin: "20px" }}>
        <Outlet />
      </div>
      {showFooter && <Footer />}
     
    </Box>
  );
}
