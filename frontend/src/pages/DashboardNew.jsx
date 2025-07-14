import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import FinancialFreedomScore from '../components/FinancialFreedomScore'

const DashboardNew = () => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        setError('Authentication required')
        setLoading(false)
        return
      }
      const response = await axios.get('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setAnalytics(response.data)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      if (err.response?.status === 401) {
        setError('Session expired. Please log in again.')
        localStorage.removeItem('token')
        setTimeout(() => window.location.href = '/login', 2000)
      } else {
        setError('Failed to load dashboard data')
      }
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(amount)
  }

  const handleCardClick = (path) => {
    console.log('Card clicked, navigating to:', path)
    navigate(path)
  }

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#0f172a',
    color: 'white',
    width: '100%',
    maxWidth: '100vw',
    overflowX: 'hidden'
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ fontSize: '1.25rem', color: '#ec4899' }}>Loading your dashboard...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={pageStyle}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#f87171' }}>{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
              Welcome back, {user?.name || 'User'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
              Here's your financial overview for {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Financial Freedom Score */}
          <FinancialFreedomScore />

          {/* Asset Breakdown */}
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid #374151',
            borderRadius: '24px',
            padding: '32px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'white', 
                margin: '0'
              }}>
                Asset Breakdown
              </h3>

            </div>
            
            {/* Asset Cards Scroller */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {/* Net Worth Card */}
              <div 
                style={{ 
                  minWidth: '180px',
                  padding: '16px',
                  backgroundColor: '#334155',
                  borderRadius: '16px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  flexShrink: 0
                }}
                onClick={() => {
                  console.log('Net Worth card clicked')
                  handleCardClick('/wealth')
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#475569'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#22c55e' 
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Net Worth</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#22c55e' }}>
                  {formatCurrency(analytics?.metrics?.current_wealth || 0)}
                </div>
              </div>

              {/* Assets Card */}
              <div 
                style={{ 
                  minWidth: '180px',
                  padding: '16px',
                  backgroundColor: '#334155',
                  borderRadius: '16px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  flexShrink: 0
                }}
                onClick={() => {
                  console.log('Assets card clicked')
                  handleCardClick('/wealth')
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#475569'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#3b82f6' 
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Total Assets</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>
                  {formatCurrency(analytics?.metrics?.current_wealth || 0)}
                </div>
              </div>

              {/* Debt Card */}
              <div 
                style={{ 
                  minWidth: '180px',
                  padding: '16px',
                  backgroundColor: '#334155',
                  borderRadius: '16px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  flexShrink: 0
                }}
                onClick={() => {
                  console.log('Debt card clicked')
                  handleCardClick('/wealth')
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#475569'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ef4444' 
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Total Debt</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444' }}>
                  {formatCurrency(50000)}
                </div>
              </div>
            </div>
            
            {/* Scroll Dots */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '8px', 
              marginTop: '16px' 
            }}>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: index === 0 ? '#10b981' : 'rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>

          {/* Income & Expenses Section */}
          <div style={{ 
            backgroundColor: '#1e293b',
            border: '1px solid #374151',
            borderRadius: '24px',
            padding: '32px',
            marginTop: '32px',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(37, 99, 235, 0.05))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '600', 
                color: 'white', 
                margin: '0'
              }}>
                Income & Expenses
              </h3>
            </div>
            
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              paddingBottom: '8px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}>
              {/* Monthly Income */}
              <div 
                style={{ 
                  minWidth: '200px',
                  padding: '16px',
                  backgroundColor: '#334155',
                  borderRadius: '16px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  flexShrink: 0
                }}
                onClick={() => {
                  console.log('Income card clicked')
                  handleCardClick('/income')
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#475569'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#22c55e' 
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Monthly Income</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#22c55e' }}>
                  {formatCurrency(analytics?.metrics?.total_income_3m / 3 || 0)}
                </div>
              </div>

              {/* Monthly Expenses */}
              <div 
                style={{ 
                  minWidth: '200px',
                  padding: '16px',
                  backgroundColor: '#334155',
                  borderRadius: '16px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  flexShrink: 0
                }}
                onClick={() => {
                  console.log('Expenses card clicked')
                  handleCardClick('/income')
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#475569'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ef4444' 
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Monthly Expenses</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444' }}>
                  {formatCurrency(analytics?.metrics?.total_expenses_3m / 3 || 0)}
                </div>
              </div>

              {/* Net Savings */}
              <div 
                style={{ 
                  minWidth: '200px',
                  padding: '16px',
                  backgroundColor: '#334155',
                  borderRadius: '16px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  scrollSnapAlign: 'start',
                  flexShrink: 0
                }}
                onClick={() => {
                  console.log('Savings card clicked')
                  handleCardClick('/income')
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#475569'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#334155'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ 
                    width: '6px', 
                    height: '6px', 
                    borderRadius: '50%', 
                    backgroundColor: '#3b82f6' 
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Net Savings</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>
                  {formatCurrency(analytics?.metrics?.net_savings_3m || 0)}
                </div>
              </div>
            </div>
            
            {/* Scroll Dots */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '8px', 
              marginTop: '16px' 
            }}>
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: index === 0 ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>
          </div>


        </div>
      </div>
    </div>
  )
}

export default DashboardNew