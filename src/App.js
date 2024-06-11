import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClientPage from './pages/ClientPage';
import AdminPage from './pages/AdminPage';
import DietPage from './pages/DietPage';
import ExercisePage from './pages/ExercisePage';
import ProfilePage from './pages/ProfilePage';
import WeightUpdatePage from './pages/WeightUpdatePage';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigationBar />
        <div className="main-content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/client" element={<ClientPage />} />
            <Route path="/client/diet" element={<DietPage />} />
            <Route path="/client/exercise" element={<ExercisePage />} />
            <Route path="/client/profile" element={<ProfilePage />} />
            <Route path="/client/weight-update" element={<WeightUpdatePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
