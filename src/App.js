import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClientPage from './pages/Client/ClientPage';
import AdminPage from './pages/Admin/AdminPage';
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
import Footer from './components/Footer';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/*" element={
            <>
              <NavigationBar />
              <div className="main-content">
                <Routes>
                  <Route exact path="/" element={<HomePage />} />
                  <Route path="/client" element={<ClientPage />} />
                  <Route path="/client/diet" element={<DietPage />} />
                  <Route path="/client/exercise" element={<ExercisePage />} />
                  <Route path="/client/profile" element={<ProfilePage />} />
                  <Route path="/client/weight-update" element={<WeightUpdatePage />} />
                </Routes>
              </div>
              <Footer />
            </>
          } />
          <Route path="/admin/*" element={
            <>
              <AdminNavBar />
              <div className="main-content">
                <Routes>
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="clients" element={<ClientsPage />} />
                  <Route path="diet-templates" element={<DietTemplatesPage />} />
                  <Route path="recipes" element={<RecipesPage />} />
                  <Route path="exercises" element={<ExercisesPage />} />
                  <Route path="motivation" element={<MotivationPage />} />
                  <Route path="reminders" element={<RemindersPage />} />
                  <Route path="faq-content" element={<FaqContentPage />} />
                </Routes>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
