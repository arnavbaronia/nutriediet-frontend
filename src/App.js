import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ClientPage from './pages/Client/ClientPage';
import AdminPage from './pages/Admin/AdminPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DietPage from './pages/Client/DietPage';
import ExercisePage from './pages/Client/ExercisePage';
import ProfilePage from './pages/Client/ProfilePage';
import CreateProfilePage from './pages/Client/CreateProfilePage';
import AccountActivationPage from './pages/Client/AccountActivationPage';
import WeightUpdatePage from './pages/Client/WeightUpdatePage';
import ClientRecipesPage from './pages/Client/ClientRecipesPage';
import AppointmentsPage from './pages/Admin/AppointmentsPage';
import ClientsPage from './pages/Admin/ClientsPage';
import ClientDetailsPage from './pages/Admin/ClientDetailsPage';
import DietTemplatesPage from './pages/Admin/DietTemplatesPage';
import CreateRecipePage from './pages/Admin/CreateRecipePage';
import UpdateRecipePage from './pages/Admin/UpdateRecipePage';
import AdminRecipeListPage from './pages/Admin/RecipeListPage';
import ExercisesPage from './pages/Admin/ExercisesPage';
import CreateDietPage from './pages/Admin/CreateDietPage';
import RemindersPage from './pages/Admin/RemindersPage';
import FaqContentPage from './pages/Admin/FaqContentPage';
import NavigationBar from './components/NavigationBar';
import AdminNavBar from './components/AdminNavBar';
import HomeNavBar from './components/HomeNavBar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import './App.css';

const ProtectedRoute = ({ component: Component, requireduser_type, ...rest }) => {
  const token = localStorage.getItem('token');
  const user_type = localStorage.getItem('user_type');

  if (!token || (requireduser_type && user_type !== requireduser_type)) {
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

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
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/create_profile/:email" element={<CreateProfilePage />} />
            <Route path="/account-activation" element={<AccountActivationPage />} />
            <Route path="/client/:client_id" element={<ProtectedRoute component={ClientPage} />} />
            <Route path="/client/:client_id/diet" element={<ProtectedRoute component={DietPage} />} />
            <Route path="/client/:client_id/exercise" element={<ProtectedRoute component={ExercisePage} />} />
            <Route path="/client/:client_id/profile" element={<ProtectedRoute component={ProfilePage} />} />
            <Route path="/client/:client_id/weight-update" element={<ProtectedRoute component={WeightUpdatePage} />} />
            <Route path="/client/recipes" element={<ProtectedRoute component={ClientRecipesPage} />} />
            <Route path="/admin/appointments" element={<ProtectedRoute component={AppointmentsPage} />} />
            <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute requireduser_type="ADMIN" component={AdminDashboard} />} />
            <Route path="/admin/clients" element={<ProtectedRoute requireduser_type="ADMIN" component={ClientsPage} />} />
            <Route path="/admin/client/:client_id" element={<ProtectedRoute requireduser_type="ADMIN" component={ClientDetailsPage} />} />
            <Route path="/admin/diet-templates" element={<ProtectedRoute requireduser_type="ADMIN" component={DietTemplatesPage} />} />
            <Route path="/admin/recipes" element={<AdminRecipeListPage />} />
            <Route path="/admin/recipes/new" element={<ProtectedRoute requireduser_type="ADMIN" component={CreateRecipePage} />} />
            <Route path="/admin/recipe/:meal_id" element={<ProtectedRoute requireduser_type="ADMIN" component={UpdateRecipePage} />} />
            <Route path="/admin/exercises" element={<ProtectedRoute requireduser_type="ADMIN" component={ExercisesPage} />} />
            <Route path="/admin/creatediet" element={<ProtectedRoute requireduser_type="ADMIN" component={CreateDietPage} />} />
            <Route path="/admin/reminders" element={<ProtectedRoute requireduser_type="ADMIN" component={RemindersPage} />} />
            <Route path="/admin/faq-content" element={<ProtectedRoute requireduser_type="ADMIN" component={FaqContentPage} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
