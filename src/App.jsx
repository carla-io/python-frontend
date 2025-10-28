import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import LoginSignup from "./pages/LoginSignup"
import ElectronicsInventoryDashboard from "./pages/Dashboard"
import ProtectedRoute from './route/ProtectedRoute';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('authToken') && localStorage.getItem('userType');
  };

  const getDashboardRoute = () => {
    const userType = localStorage.getItem('userType');
    switch (userType) {
      case 'admin':
        return '/admin';
      case 'technician':
        return '/technician';
      case 'user':
        return '/dashboard';
      default:
        return '/';
    }
  };
  
  return (
    <Router>
      <Routes>
        {/* Redirect `/` to appropriate dashboard or login */}
        <Route 
          path="/" 
          element={
            isAuthenticated() ? 
            <Navigate to={getDashboardRoute()} /> : 
            <Navigate to="/login" />
          } 
        />

        {/* Login/Signup page */}
        <Route path="/login" element={<LoginSignup />} />

        {/* Admin Dashboard - Electronics Inventory */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <ElectronicsInventoryDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Technician Dashboard - Electronics Inventory */}
        <Route 
          path="/technician" 
          element={
            <ProtectedRoute>
              <ElectronicsInventoryDashboard />
            </ProtectedRoute>
          } 
        />

        {/* User Dashboard - Electronics Inventory */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <ElectronicsInventoryDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Electronics Inventory specific routes for different user types */}
        <Route 
          path="/inventory" 
          element={
            <ProtectedRoute>
              <ElectronicsInventoryDashboard />
            </ProtectedRoute>
          } 
        />

        {/* Catch all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App