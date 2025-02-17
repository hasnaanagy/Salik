import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUpPage from "../pages/SignupPage";
import LoginPage from "../pages/LoginPage"
import AddTrip from "../pages/AddTrip";
import AddFuel from "../pages/addFuel";
import AddMechanic from "../pages/addMechanic";
import UploadLicence from "../pages/UploadLicence";
export default function MainLayout() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/addTrip" element={<AddTrip />} />
        <Route path="/addFuel" element={<AddFuel />} />
        <Route path="/addMechanic" element={<AddMechanic />} />
        <Route path="/licence" element={<UploadLicence />} />
      </Routes>
    </Router>
  );
}
