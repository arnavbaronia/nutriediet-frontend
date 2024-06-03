import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import ClientPage from './pages/ClientPage';
import DietPage from './pages/DietPage';
import WeightUpdatePage from './pages/WeightUpdatePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/client/profile" element={<ProfilePage />} />
        <Route path="/client/diet" element={<DietPage />} />
        <Route path="/client/weight-update" element={<WeightUpdatePage />} />
      </Routes>
    </Router>
  );
}

export default App;
