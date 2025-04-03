import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useParams, useLocation } from 'react-router-dom';
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
import MotivationPage from './pages/Admin/MotivationPage';
import NavigationBar from './components/NavigationBar';
import AdminNavBar from './components/AdminNavBar';
import HomeNavBar from './components/HomeNavBar';
import Footer from './components/Footer';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminLogin from './components/AdminLogin';
import './App.css';

const ProtectedRoute = ({ component: Component, requireduser_type, ...rest }) => {
  const token = localStorage.getItem('token');
  const user_type = localStorage.getItem('user_type');
  const is_active = localStorage.getItem('is_active') === 'true';
  const params = useParams();

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (requireduser_type && user_type !== requireduser_type) {
    return <Navigate to="/login" />;
  }

  if (user_type === 'CLIENT' && !is_active) {
    return <Navigate to="/account-activation" />;
  }

  return <Component {...rest} />;
};

function AppContent() {
  const location = useLocation();
  const showFooterPages = ["/", "/about", "/services", "/testimonials", "/login", "/signup", "/admin/login"];
  const showFooter = showFooterPages.includes(location.pathname);

  return (
    <div className="App">
      <Routes>
        <Route path="/admin/*" element={<AdminNavBar />} />
        <Route path="/*" element={<HomeNavBar />} />
        <Route path="/clients/*" element={<NavigationBar />} />
        <Route path="/admin/login" element={<HomeNavBar />} />
        <Route path="/account-activation" element={<NavigationBar />} />
      </Routes>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/testimonials" element={<TestimonialsPageUpdated />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/create_profile/:email" element={<CreateProfilePage />} />
          <Route path="/account-activation" element={<AccountActivationPage />} />
          <Route path="/clients" element={<ProtectedRoute component={ClientPage} />} />
          <Route path="/clients/:client_id/diet" element={<ProtectedRoute component={DietPage} />} />
          <Route path="/clients/:client_id/exercise" element={<ProtectedRoute component={ExercisePage} />} />
          <Route path="/clients/:client_id/my_profile" element={<ProtectedRoute component={ProfilePage} />} />
          <Route path="/clients/:client_id/weight_update" element={<ProtectedRoute component={WeightUpdatePage} />} />
          <Route path="/clients/:client_id/recipe" element={<ProtectedRoute component={ClientRecipesPage} />} />
          <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
          <Route path="/admin/dashboard" element={<ProtectedRoute requireduser_type="ADMIN" component={AdminDashboard} />} />
          <Route path="/admin/clients" element={<ProtectedRoute requireduser_type="ADMIN" component={ClientsPage} />} />
          <Route path="/admin/clients/:client_id" element={<ProtectedRoute requireduser_type="ADMIN" component={ClientDetailsPage} />} />
          <Route path="/admin/common_diet" element={<ProtectedRoute requireduser_type="ADMIN" component={CommonDietPage} />} />
          <Route path="/admin/diet_templates" element={<ProtectedRoute requireduser_type="ADMIN" component={DietTemplatesPage} />} />
          <Route path="/admin/diet_templates/save_as" element={<ProtectedRoute requireduser_type="ADMIN" component={SaveAsDietTemplatePage} />} />
          <Route path="/admin/diet_templates/new" element={<ProtectedRoute requireduser_type="ADMIN" component={CreateDietTemplatePage} />} />
          <Route path="/admin/diet_templates/:diet_template_id" element={<ProtectedRoute requireduser_type="ADMIN" component={EditDietTemplatePage} />} />
          <Route path="/admin/recipes" element={<AdminRecipeListPage />} />
          <Route path="/admin/recipes/new" element={<ProtectedRoute requireduser_type="ADMIN" component={CreateRecipePage} />} />
          <Route path="/admin/recipes/:meal_id" element={<ProtectedRoute requireduser_type="ADMIN" component={UpdateRecipePage} />} />
          <Route path="/admin/exercises" element={<ProtectedRoute requireduser_type="ADMIN" component={ExercisesPage} />} />
          <Route path="/admin/exercises/new" element={<ProtectedRoute requireduser_type="ADMIN" component={CreateExercisePage} />} />
          <Route path="/admin/exercises/:id" element={<ProtectedRoute requireduser_type="ADMIN" component={EditExercisePage} />} />
          <Route path="/admin/motivations" element={<ProtectedRoute requireduser_type="ADMIN" component={MotivationPage} />} />
          <Route path="/admin/:client_id/creatediet" element={<ProtectedRoute requireduser_type="ADMIN" component={CreateDietPage} />} />
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