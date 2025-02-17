import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import AddTrip from "../pages/AddTrip";
import AddFuel from "../pages/addFuel";
import AddMechanic from "../pages/addMechanic";
import { SharedLayout } from "./SharedLayout";
import Home from "../pages/Home";

export default function MainLayout() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SharedLayout />}>
            <Route index element={<Home />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/addTrip" element={<AddTrip />} />
            <Route path="/addFuel" element={<AddFuel />} />
            <Route path="/addMechanic" element={<AddMechanic />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}
