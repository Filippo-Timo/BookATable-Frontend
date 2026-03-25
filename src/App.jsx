import { BrowserRouter, Routes, Route } from "react-router-dom"
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
import Footer from "./components/Footer"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <AppNavbar />
            <HomePage />
          </ProtectedRoute>
        } />
        <Route path="/restaurants/:id" element={
          <ProtectedRoute>
            <AppNavbar />
            <RestaurantDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/restaurants/:id/booking" element={
          <ProtectedRoute requiredRole="USER">
            <AppNavbar />
            <BookingPage />
          </ProtectedRoute>
        } />
        <Route path="/reservations" element={
          <ProtectedRoute requiredRole="USER">
            <AppNavbar />
            <MyReservationsPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute requiredRole="USER">
            <AppNavbar />
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/new" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <ManageRestaurantPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/restaurants/:id" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <ManageRestaurantPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/restaurants/:id/menu" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <ManageMenuPage />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/restaurants/:id/reservations" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <OwnerReservationsPage />
          </ProtectedRoute>
        } />
        <Route path="/owner-profile" element={
          <ProtectedRoute requiredRole="RESTAURANT_OWNER">
            <AppNavbar />
            <OwnerProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App