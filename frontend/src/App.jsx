import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import SoilSuitability from './pages/SoilSuitability'
import CropRecommendation from './pages/CropRecommendation'
import DroughtResistance from './pages/DroughtResistance'
import CropDisease from './pages/CropDisease'
import Profile from './pages/Profile'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const ProtectedRoute = ({ children }) => {
    if (!localStorage.getItem('token')) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/suitability" element={
          <ProtectedRoute><SoilSuitability /></ProtectedRoute>
        } />
        <Route path="/crop-recommendation" element={
          <ProtectedRoute><CropRecommendation /></ProtectedRoute>
        } />
        <Route path="/drought" element={
          <ProtectedRoute><DroughtResistance /></ProtectedRoute>
        } />
        <Route path="/disease" element={
          <ProtectedRoute><CropDisease /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App