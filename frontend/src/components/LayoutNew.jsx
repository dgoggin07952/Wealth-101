import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const LayoutNew = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊', category: 'overview' },
    { name: 'Wealth', href: '/wealth', icon: '💰', category: 'overview' },
    { name: 'Income & Expenses', href: '/income', icon: '📈', category: 'overview' },
    { name: 'Insurance', href: '/insurance', icon: '🛡️', category: 'management' },
    { name: 'Goals & Projections', href: '/milestones', icon: '🎯', category: 'planning' },
    { name: 'Reports', href: '/reports', icon: '📄', category: 'analysis' },
  ]

  const categories = {
    overview: { name: 'Overview', color: '#10b981' },
    management: { name: 'Management', color: '#3b82f6' },
    planning: { name: 'Planning', color: '#ec4899' },
    analysis: { name: 'Analysis', color: '#f59e0b' }
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Top Right Dropdown Menu */}
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
        zIndex: 1000
      }}>
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '50px',
            padding: '10px 20px',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(30, 41, 59, 1)'
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'rgba(30, 41, 59, 0.8)'
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)'
          }}
        >
          <span style={{ fontSize: '1.2rem' }}>👤</span>
          <span>Menu</span>
          <span style={{ fontSize: '0.8rem' }}>▼</span>
        </button>

        {/* Dropdown Content */}
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '10px',
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '8px',
            minWidth: '180px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
          }}>
            <Link
              to="/profile"
              onClick={() => setShowDropdown(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                textDecoration: 'none',
                color: location.pathname === '/profile' ? '#ec4899' : '#e2e8f0',
                backgroundColor: location.pathname === '/profile' ? 'rgba(236, 72, 153, 0.1)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/profile') {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/profile') {
                  e.target.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>👤</span>
              <span>Profile</span>
            </Link>
            <button
              onClick={() => {
                setShowDropdown(false)
                handleLogout()
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                backgroundColor: 'transparent',
                border: 'none',
                color: '#ef4444',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>🚪</span>
              <span>Log Out</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        width: '100%',
        paddingBottom: '100px',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {children}
      </div>

      {/* Bottom Navigation - Absolute Position */}
      <div style={{
        position: 'absolute',
        bottom: '0px',
        left: '0px',
        right: '0px',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        height: '80px',
        padding: '0 20px'
      }}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const category = categories[item.category]
          return (
            <Link
              key={item.name}
              to={item.href}
              style={{
                color: isActive ? category.color : '#94a3b8',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '60px',
                height: '60px',
                transition: 'all 0.3s ease',
                borderRadius: '50%'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <span style={{ fontSize: '2rem' }}>
                {item.icon}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default LayoutNew