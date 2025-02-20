import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddTrip from "../pages/AddTrip";
import UploadLicence from "../pages/UploadLicence";
import { SharedLayout } from "./SharedLayout";
import Home from "../pages/Home";
import Login from "../pages/LoginPage";
import SignUpPage from "../pages/SignupPage";
import Reviews from "../pages/Reviews";
import AddService from "../pages/AddService";
import { ProviderNotifications } from "../components/providerNotifications";

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
            <Route
              path="/providerNotifications"
              element={<ProviderNotifications />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
