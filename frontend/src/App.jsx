import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Layout from './components/LayoutNew'
import Login from './pages/Login'
import Dashboard from './pages/DashboardNew'
import Wealth from './pages/Wealth'
import Income from './pages/Income'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import Milestones from './pages/Milestones'
import Insurance from './pages/Insurance'
import Projections from './pages/Projections'



function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f172a' }}>
        <div style={{ color: '#ec4899', fontSize: '1.25rem' }}>Loading...</div>
      </div>
    )
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen" style={{ backgroundColor: '#0f172a' }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <PrivateRoute>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/wealth" element={<Wealth />} />

                      <Route path="/income" element={<Income />} />
                      <Route path="/milestones" element={<Milestones />} />
                      <Route path="/projections" element={<Projections />} />
                      <Route path="/insurance" element={<Insurance />} />
                      <Route path="/reports" element={<Reports />} />

                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </Layout>
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App