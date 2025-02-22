import React from "react";
import { Routes, Route } from "react-router-dom";
import AddTrip from "../pages/AddTrip";
import UploadLicence from "../pages/UploadLicence";
import { SharedLayout } from "./SharedLayout";
import Home from "../pages/Home";
import Login from "../pages/LoginPage";
import SignUpPage from "../pages/SignupPage";
import Reviews from "../pages/Reviews";
import AddService from "../pages/AddService";

import EditProfile from "../pages/EditProfile";
import { BrowserRouter } from "react-router-dom";

import { ProviderNotifications } from "../components/providerNotifications";
import Activity from "../pages/Activity";
import ProviderRequests from "../components/ProviderRequests";

export default function MainLayout() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/addTrip" element={<AddTrip />} />
            <Route path="/addService" element={<AddService />} />
            <Route path="/licence" element={<UploadLicence />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/uploadLiscence" element={<UploadLicence />} />
            <Route path="/activities" element={<Activity />} />
           <Route path="/requests" element={<ProviderRequests />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
