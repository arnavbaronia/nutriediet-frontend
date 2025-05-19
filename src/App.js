import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import TestimonialsPageUpdated from './pages/TestimonialsPageUpdated';
import ClientPage from './pages/Client/ClientPage';
import AdminDashboard from './pages/Admin/AdminDashboard';
import DietPage from './pages/Client/DietPage';
import ExercisePage from './pages/Client/ExercisePage';
import ProfilePage from './pages/Client/ProfilePage';
import CreateProfilePage from './pages/Client/CreateProfilePage';
import AccountActivationPage from './pages/Client/AccountActivationPage';
import WeightUpdatePage from './pages/Client/WeightUpdatePage';
import ClientRecipesPage from './pages/Client/ClientRecipesPage';
import ClientsPage from './pages/Admin/ClientsPage';
import CommonDietPage from './pages/Admin/CommonDietPage';
import ClientDetailsPage from './pages/Admin/ClientDetailsPage';
import DietTemplatesPage from './pages/Admin/DietTemplatesPage';
import SaveAsDietTemplatePage from './pages/Admin/SaveAsDietTemplatePage';
import CreateDietTemplatePage from './pages/Admin/CreateDietTemplatePage';
import EditDietTemplatePage from './pages/Admin/EditDietTemplatePage';
import CreateRecipePage from './pages/Admin/CreateRecipePage';
import UpdateRecipePage from './pages/Admin/UpdateRecipePage';
import AdminRecipeListPage from './pages/Admin/RecipeListPage';
import ExercisesPage from './pages/Admin/ExercisesPage';
import CreateExercisePage from './pages/Admin/CreateExercisePage';
import EditExercisePage from './pages/Admin/EditExercisePage';
import CreateDietPage from './pages/Admin/CreateDietPage';
import CreateMotivationPage from './pages/Admin/CreateMotivationPage';
import MotivationManagementPage from "./pages/Admin/MotivationManagementPage";
import NavigationBar from './components/NavigationBar';
import AdminNavBar from './components/AdminNavBar';
import HomeNavBar from './components/HomeNavBar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import BackButton from './components/BackButton';
import ProtectedRoute from './auth/ProtectedRoute';
import './App.css';

function AppContent() {
  const location = useLocation();
  const showFooterPages = ["/", "/about", "/services", "/testimonials", "/login", "/signup", "/admin/login"];
  const showFooter = showFooterPages.includes(location.pathname);

  const AdminRouteWrapper = ({ children }) => (
    <BackButton>
      {children}
    </BackButton>
  );

  return (
    <div className="App">
      {/* Navigation bars */}
      <Routes>
        <Route path="/admin/*" element={<AdminNavBar />} />
        <Route path="/*" element={<HomeNavBar />} />
        <Route path="/clients/*" element={<NavigationBar />} />
        <Route path="/admin/login" element={<HomeNavBar />} />
        <Route path="/account-activation" element={<NavigationBar />} />
      </Routes>

      <div className="main-content">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/testimonials" element={<TestimonialsPageUpdated />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/create_profile/:email" element={<CreateProfilePage />} />
          <Route path="/account-activation" element={<AccountActivationPage />} />

          {/* Client routes */}
          <Route path="/clients" element={
            <ProtectedRoute>
              <ClientPage />
            </ProtectedRoute>
          } />
          <Route path="/clients/:client_id/diet" element={
            <ProtectedRoute>
              <DietPage />
            </ProtectedRoute>
          } />
          <Route path="/clients/:client_id/exercise" element={
            <ProtectedRoute>
              <ExercisePage />
            </ProtectedRoute>
          } />
          <Route path="/clients/:client_id/my_profile" element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/clients/:client_id/weight_update" element={
            <ProtectedRoute>
              <WeightUpdatePage />
            </ProtectedRoute>
          } />
          <Route path="/clients/:client_id/recipe" element={
            <ProtectedRoute>
              <ClientRecipesPage />
            </ProtectedRoute>
          } />

          {/* Admin routes */}
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <AdminDashboard />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/clients" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <ClientsPage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/clients/:client_id" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <ClientDetailsPage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/common_diet" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <CommonDietPage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/diet_templates" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <DietTemplatesPage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/diet_templates/save_as" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <SaveAsDietTemplatePage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/diet_templates/new" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <CreateDietTemplatePage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/diet_templates/:diet_template_id" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <EditDietTemplatePage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/recipes" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <AdminRecipeListPage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/recipes/create" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <CreateRecipePage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/recipes/:recipe_id" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <UpdateRecipePage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/exercises" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <ExercisesPage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/exercises/new" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <CreateExercisePage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/exercises/:id" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <EditExercisePage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/motivations" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <MotivationManagementPage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/motivations/new" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <CreateMotivationPage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
          <Route path="/admin/:client_id/creatediet" element={
            <ProtectedRoute requireduser_type="ADMIN">
              <AdminRouteWrapper>
                <CreateDietPage />
              </AdminRouteWrapper>
            </ProtectedRoute>
          } />
        </Routes>
      </div>

      {showFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;