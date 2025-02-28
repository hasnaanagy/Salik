import React from "react";
import { RideSearch } from "../components/RideSearchHome/RideSearch";
import ServicesHome from "../components/ServicesComponent/ServicesHome";
import { IntoScreen } from "../components/ServicesComponent/IntoScreen";
import { useSelector } from "react-redux";
import { CircularProgress, Typography, Box } from "@mui/material";

export default function Home() {
  const { user, loading, error } = useSelector((state) => state.auth);
  const token = localStorage.getItem("token");

  // ✅ عرض "loading" أثناء تحميل البيانات
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

  // ✅ إذا لم يكن هناك مستخدم، عرض المحتوى الافتراضي
  if (!user || !token) {
    return (
      <>
        <RideSearch />
        <ServicesHome />
        <IntoScreen />
      </>
    );
  }

  // ✅ عرض المحتوى بناءً على نوع المستخدم
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
