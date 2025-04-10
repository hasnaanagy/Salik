import React from "react";
import { RideSearch } from "../components/RideSearchHome/RideSearch";
import ServicesHome from "../components/ServicesComponent/ServicesHome";
import Home2 from "./Home2";
import { IntoScreen } from "../components/ServicesComponent/IntoScreen";
import { useSelector } from "react-redux";
import { CircularProgress, Typography, Box } from "@mui/material";
import Dashboard from "./Dashboard";

export default function Home() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (!user || !token) {
    return (
      <>
        <Home2 />
        {/* <RideSearch />
        <ServicesHome />
        <IntoScreen /> */}
      </>
    );
  }

  // ✅ عرض المحتوى بناءً على نوع المستخدم
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
