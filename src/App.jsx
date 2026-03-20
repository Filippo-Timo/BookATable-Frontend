import { BrowserRouter, Routes, Route } from "react-router-dom"
import AuthPage from "./pages/AuthPage"
import ProtectedRoute from "./components/ProtectedRoute"
import AppNavbar from "./components/AppNavbar"
import HomePage from "./pages/HomePage"
import RestaurantDetailPage from "./pages/RestaurantDetailPage"
import BookingPage from "./pages/BookingPage"
import MyReservationsPage from "./pages/MyReservationsPage"
import ProfilePage from "./pages/ProfilePage"

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
      </Routes>
    </BrowserRouter>
  )
}

export default App
