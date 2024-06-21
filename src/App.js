import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClientPage from './pages/Client/ClientPage';
import AdminPage from './pages/Admin/AdminPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DietPage from './pages/Client/DietPage';
import ExercisePage from './pages/Client/ExercisePage';
import ProfilePage from './pages/Client/ProfilePage';
import WeightUpdatePage from './pages/Client/WeightUpdatePage';
import AppointmentsPage from './pages/Admin/AppointmentsPage';
import ClientsPage from './pages/Admin/ClientsPage';
import DietTemplatesPage from './pages/Admin/DietTemplatesPage';
import RecipesPage from './pages/Admin/RecipesPage';
import ExercisesPage from './pages/Admin/ExercisesPage';
import MotivationPage from './pages/Admin/MotivationPage';
import RemindersPage from './pages/Admin/RemindersPage';
import FaqContentPage from './pages/Admin/FaqContentPage';
import NavigationBar from './components/NavigationBar';
import AdminNavBar from './components/AdminNavBar';
import HomeNavBar from './components/HomeNavBar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import ProtectedRoute from './auth/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/admin/*" element={<AdminNavBar />} />
          <Route path="/*" element={<HomeNavBar />} />
          <Route path="/client/*" element={<NavigationBar />} />
        </Routes>
        <div className="main-content">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/client/:client_id" element={<ProtectedRoute component={ClientPage} />} />
            <Route path="/client/:client_id/diet" element={<ProtectedRoute component={DietPage} />} />
            <Route path="/client/:client_id/exercise" element={<ProtectedRoute component={ExercisePage} />} />
            <Route path="/client/:client_id/profile" element={<ProtectedRoute component={ProfilePage} />} />
            <Route path="/client/:client_id/weight-update" element={<ProtectedRoute component={WeightUpdatePage} />} />
            <Route path="/admin/appointments" element={<ProtectedRoute component={AppointmentsPage} />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute requiredUserType="ADMIN" component={AdminDashboard} />} />
            <Route path="/admin/clients" element={<ProtectedRoute component={ClientsPage} />} />
            <Route path="/admin/diet-templates" element={<ProtectedRoute component={DietTemplatesPage} />} />
            <Route path="/admin/recipes" element={<ProtectedRoute component={RecipesPage} />} />
            <Route path="/admin/exercises" element={<ProtectedRoute component={ExercisesPage} />} />
            <Route path="/admin/motivation" element={<ProtectedRoute component={MotivationPage} />} />
            <Route path="/admin/reminders" element={<ProtectedRoute component={RemindersPage} />} />
            <Route path="/admin/faq-content" element={<ProtectedRoute component={FaqContentPage} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
