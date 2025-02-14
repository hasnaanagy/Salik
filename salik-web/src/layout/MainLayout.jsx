import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthPage from '../pages/AuthPage';
import Home from '../pages/Home';
import AddTrip from '../components/AddTrip';

export default function MainLayout() {
  return (
    <Router>
      <Routes>
        {/* <Route path="/auth" element={<AuthPage />} /> */}
        <Route path="/" element={<AuthPage />} />
        <Route path="/addTrip" element={<AddTrip />} />
      </Routes>
    </Router>
  );
}