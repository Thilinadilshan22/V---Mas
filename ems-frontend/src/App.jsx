import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import ProfilePage from './pages/ProfilePage'
import VehiclesPage from './pages/VehiclesPage'
import ServicePage from './pages/ServicePage'
import FuelAnalysisPage from './pages/FuelAnalysisPage'
import LocationPage from './pages/LocationPage'
import ReportsPage from './pages/ReportsPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login"        element={<LoginPage />} />
          <Route path="/register"     element={<RegisterPage />} />
          <Route path="/dashboard"    element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
          <Route path="/users"        element={<PrivateRoute><UsersPage /></PrivateRoute>} />
          <Route path="/profile"      element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/vehicles"     element={<PrivateRoute><VehiclesPage /></PrivateRoute>} />
          <Route path="/service"      element={<PrivateRoute><ServicePage /></PrivateRoute>} />
          <Route path="/fuel-analysis" element={<PrivateRoute><FuelAnalysisPage /></PrivateRoute>} />
          <Route path="/location"     element={<PrivateRoute><LocationPage /></PrivateRoute>} />
          <Route path="/reports"      element={<PrivateRoute><ReportsPage /></PrivateRoute>} />
          <Route path="/"             element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
