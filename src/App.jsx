import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AppNavbar from "./components/AppNavbar"
import HomePage from "./pages/HomePage"
import RestaurantDetailPage from "./pages/RestaurantDetailPage"
import BookingPage from "./pages/BookingPage"
import MyReservationsPage from "./pages/MyReservationsPage"
import ProfilePage from "./pages/ProfilePage"
import DashboardPage from "./pages/DashboardPage"
import ManageRestaurantPage from "./pages/ManageRestaurantPage"
import ManageMenuPage from "./pages/ManageMenuPage"
import OwnerReservationsPage from "./pages/OwnerReservationsPage"
import OwnerProfilePage from "./pages/OwnerProfilePage"
import HowItWorksPage from "./pages/HowItWorksPage"
import Footer from "./components/Footer"

// Componente separato per gestire il Footer condizionale
// useLocation non può essere usato direttamente in App perché è fuori da BrowserRouter
function AppContent() {
  const location = useLocation()

  // Nascondo il footer nella pagina di auth
  const hideFooter = location.pathname === "/auth"

  return (
    <>
      <Routes>

        {/* Auth Page */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Home Page */}
        <Route path="/" element={
          <ProtectedRoute>
            <AppNavbar />
            <HomePage />
          </ProtectedRoute>
        } />

        {/* Restaurant Detail Page */}
        <Route path="/restaurants/:id" element={
          <ProtectedRoute>
            <AppNavbar />
            <RestaurantDetailPage />
          </ProtectedRoute>
        } />

        {/* Booking Page - solo USER */}
        <Route path="/restaurants/:id/booking" element={
          <ProtectedRoute requiredRole="USER">
            <AppNavbar />
            <BookingPage />
          </ProtectedRoute>
        } />

        {/* My Reservations Page - solo USER */}
        <Route path="/reservations" element={
          <ProtectedRoute requiredRole="USER">
            <AppNavbar />
            <MyReservationsPage />
          </ProtectedRoute>
        } />

        {/* Profile Page - solo USER */}
        <Route path="/profile" element={
          <ProtectedRoute requiredRole="USER">
            <AppNavbar />
            <ProfilePage />
          </ProtectedRoute>
        } />

        {/* Dashboard Page - solo RESTAURANT_OWNER */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* Manage Restaurant Page - creazione nuovo ristorante - solo RESTAURANT_OWNER */}
        <Route path="/dashboard/new" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <ManageRestaurantPage />
          </ProtectedRoute>
        } />

        {/* Manage Restaurant Page - modifica ristorante esistente - solo RESTAURANT_OWNER */}
        <Route path="/dashboard/restaurants/:id" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <ManageRestaurantPage />
          </ProtectedRoute>
        } />

        {/* Manage Menu Page - solo RESTAURANT_OWNER */}
        <Route path="/dashboard/restaurants/:id/menu" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <ManageMenuPage />
          </ProtectedRoute>
        } />

        {/* Owner Reservations Page - solo RESTAURANT_OWNER */}
        <Route path="/dashboard/restaurants/:id/reservations" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <OwnerReservationsPage />
          </ProtectedRoute>
        } />

        {/* Owner Profile Page - solo RESTAURANT_OWNER */}
        <Route path="/owner-profile" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <OwnerProfilePage />
          </ProtectedRoute>
        } />

        {/* How It Works Page - accessibile a tutti gli utenti loggati */}
        <Route path="/how-it-works" element={
          <ProtectedRoute>
            <AppNavbar />
            <HowItWorksPage />
          </ProtectedRoute>
        } />

      </Routes>

      {/* Footer - nascosto nella pagina di auth */}
      {!hideFooter && <Footer />}
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App