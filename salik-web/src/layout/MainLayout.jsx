import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AddTrip from "../pages/AddTrip";
import UploadLicence from "../pages/UploadLicence";
import { SharedLayout } from "./SharedLayout";
import Home from "../pages/Home";
import Login from "../pages/LoginPage";
import SignUpPage from "../pages/SignupPage";
import Reviews from "../pages/Reviews";
import AddService from "../pages/AddService";
import EditProfile from "../pages/EditProfile";
import Activity from "../pages/Activity";
import Requests from "../components/Requests";
import ProtectedRoute from "./ProtectedRoute"; // Import ProtectedRoute
import Home2 from "../pages/Home2";
import Services from "../pages/Services";
import Dashboard from "../pages/Dashboard";
import Chat from "../pages/Chat";

export default function MainLayout() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes - Accessible by everyone */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<SharedLayout />}>
          <Route index element={<Home />} />

          {/* Protected Routes - Require Authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/addTrip" element={<AddTrip />} />
            <Route path="/addService" element={<AddService />} />
            <Route path="/licence" element={<UploadLicence />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/uploadLiscence" element={<UploadLicence />} />
            <Route path="/activities" element={<Activity />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/home2" element={<Home2 />} />
            <Route path="/servicesprovider" element={<Services />} />
            <Route path="/Salik Assistant" element={<Chat />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
