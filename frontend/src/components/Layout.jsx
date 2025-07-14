import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/', icon: '📊', category: 'overview' },
    { name: 'Insurance', href: '/insurance', icon: '🛡️', category: 'management' },
    { name: 'Milestones', href: '/milestones', icon: '🎯', category: 'planning' },
    { name: 'Projections', href: '/projections', icon: '🚀', category: 'planning' },
    { name: 'Reports', href: '/reports', icon: '📄', category: 'analysis' },
  ]

  const categories = {
    overview: { name: 'Overview', color: '#10b981' },
    management: { name: 'Management', color: '#3b82f6' },
    planning: { name: 'Planning', color: '#ec4899' },
    analysis: { name: 'Analysis', color: '#f59e0b' }
  }

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Right Icons - Fixed Position */}
      <div style={{
        position: 'fixed',
        top: '32px',
        right: '32px',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '32px'
      }}>
        <Link
          to="/achievements"
          className="transition-all duration-300 hover:scale-125"
          style={{
            color: location.pathname === '/achievements' ? '#ec4899' : '#94a3b8',
            textDecoration: 'none'
          }}
        >
          <span style={{ fontSize: '4rem' }}>🏆</span>
        </Link>
        <Link
          to="/profile"
          className="transition-all duration-300 hover:scale-125"
          style={{
            color: location.pathname === '/profile' ? '#ec4899' : '#94a3b8',
            textDecoration: 'none'
          }}
        >
          <span style={{ fontSize: '4rem' }}>👤</span>
        </Link>
        <button
          onClick={handleLogout}
          className="transition-all duration-300 hover:scale-125"
          style={{
            color: '#ef4444',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '4rem' }}>🚪</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto" style={{ paddingBottom: '100px' }}>
        {children}
      </div>

      {/* Bottom Navigation - Fixed Position */}
      <div style={{
        position: 'fixed',
        bottom: '0px',
        left: '0px',
        right: '0px',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.12)',
        height: '100px',
        padding: '0 20px'
      }}>
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          const category = categories[item.category]
          return (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center justify-center transition-all duration-300 group"
              style={{
                color: isActive ? category.color : '#94a3b8',
                textDecoration: 'none',
                width: '80px',
                height: '80px'
              }}
            >
              <span 
                className="group-hover:scale-125 transition-transform duration-200"
                style={{ fontSize: '3rem' }}
              >
                {item.icon}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Layout