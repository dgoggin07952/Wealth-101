import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setIsAuthenticated(true)
      // Set up demo user for testing
      if (token === 'demo-token') {
        setCurrentUser({
          id: 1,
          email: 'demo@wealthtracker.com',
          name: 'Demo User',
          home_currency: 'GBP'
        })
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      // Demo login for testing
      if (email === 'demo@wealthtracker.com' && password === 'demo123') {
        const demoToken = 'demo-token'
        const demoUser = {
          id: 1,
          email: 'demo@wealthtracker.com',
          name: 'Demo User',
          home_currency: 'GBP'
        }
        
        localStorage.setItem('token', demoToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${demoToken}`
        setCurrentUser(demoUser)
        setIsAuthenticated(true)
        return { success: true }
      }

      // Also try the simplified demo credentials
      if (email === 'demo@example.com' && password === 'demo123') {
        const demoToken = 'demo-token'
        const demoUser = {
          id: 1,
          email: 'demo@example.com',
          name: 'Demo User',
          home_currency: 'GBP'
        }
        
        localStorage.setItem('token', demoToken)
        axios.defaults.headers.common['Authorization'] = `Bearer ${demoToken}`
        setCurrentUser(demoUser)
        setIsAuthenticated(true)
        return { success: true }
      }

      const response = await axios.post('/api/auth/login', {
        email,
        password
      })
      
      const { access_token, user } = response.data
      localStorage.setItem('token', access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setCurrentUser(user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Login failed' 
      }
    }
  }

  const register = async (email, password, name, homeCurrency = 'GBP') => {
    try {
      const response = await axios.post('/api/auth/register', {
        email,
        password,
        name,
        home_currency: homeCurrency
      })
      
      const { access_token, user } = response.data
      localStorage.setItem('token', access_token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`
      setCurrentUser(user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.detail || 'Registration failed' 
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setCurrentUser(null)
    setIsAuthenticated(false)
  }

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}