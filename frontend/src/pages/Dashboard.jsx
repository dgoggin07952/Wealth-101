import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const Dashboard = () => {
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
      const response = await axios.get('/api/analytics', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setAnalytics(response.data)
    } catch (err) {
      console.error('Failed to fetch analytics:', err)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const handleCardClick = (path) => {
    console.log('Card clicked, navigating to:', path)
    navigate(path)
  }

  const pageStyle = {
    minHeight: '100vh',
    backgroundColor: '#0f1419',
    color: 'white',
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  }

  const cardStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '20px',
    padding: '24px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#22c55e' }}>Loading your dashboard...</div>
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
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#ec4899', margin: '0 0 8px 0' }}>
              🔥 CACHE TEST - Welcome back, {user?.name || 'User'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
              Here's your financial overview for {new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </p>
          </div>

          {/* Scrollable Asset Breakdown */}
          <div style={{
            backgroundColor: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '24px',
            padding: '32px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 
                style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: 'white', 
                  margin: '0',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onClick={() => {
                  console.log('Asset Breakdown header clicked')
                  navigate('/wealth')
                }}
                onMouseEnter={(e) => e.target.style.color = '#22c55e'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                Asset Breakdown - UPDATED
              </h3>
              <button
                type="button"
                style={{
                  background: '#ec4899',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('TEST BUTTON CLICKED')
                  alert('TEST BUTTON WORKS!')
                  navigate('/wealth')
                }}
              >
                TEST BUTTON
              </button>
            </div>
            
            {/* Asset Cards - Using EXACT same pattern as Income/Expense cards */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              justifyContent: 'center'
            }}>
              {/* Net Worth Overview */}
              <div 
                style={{ 
                  width: '180px',
                  padding: '16px',
                  backgroundColor: '#334155',
                  borderRadius: '16px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
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

              {/* Gross Assets */}
              <div 
                style={{ 
                  width: '180px',
                  padding: '16px',
                  backgroundColor: '#334155',
                  borderRadius: '16px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  console.log('Gross Assets card clicked')
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
                  <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Gross Assets</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#22c55e' }}>
                  {formatCurrency(analytics?.metrics?.current_wealth || 0)}
                </div>
              </div>

              {/* Total Debt */}
              <div 
                style={{ 
                  width: '180px',
                  padding: '16px',
                  backgroundColor: '#334155',
                  borderRadius: '16px',
                  border: '1px solid #475569',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onClick={() => {
                  console.log('Total Debt card clicked')
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




          </div>

          {/* Income & Expenses Overview */}
          <div style={{ marginTop: '32px' }}>
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '24px',
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
            }}>
              <h2 
                style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: 'white', 
                  margin: '0 0 24px 0',
                  cursor: 'pointer',
                  transition: 'color 0.3s ease'
                }}
                onClick={() => navigate('/income')}
                onMouseEnter={(e) => e.target.style.color = '#22c55e'}
                onMouseLeave={(e) => e.target.style.color = 'white'}
              >
                Income & Expenses
              </h2>
              
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                overflowX: 'auto', 
                paddingBottom: '16px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#475569 #1e293b',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }} 
              id="dashboard-income-scroller"
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft
                const scrollWidth = e.target.scrollWidth - e.target.clientWidth
                const scrollPercentage = scrollLeft / scrollWidth
                
                // Update dots based on scroll position
                const dots = document.querySelectorAll('.dashboard-income-dot')
                dots.forEach((dot, index) => {
                  const dotPosition = index / (dots.length - 1)
                  const isActive = Math.abs(scrollPercentage - dotPosition) < 0.3
                  dot.style.backgroundColor = isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.3)'
                  dot.style.transform = isActive ? 'scale(1.2)' : 'scale(1)'
                })
              }}>
                {/* Monthly Income */}
                <div 
                  style={{ 
                    minWidth: '180px',
                    width: '180px',
                    padding: '16px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0,
                    backgroundColor: '#334155',
                    borderRadius: '16px',
                    border: '1px solid #475569',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => {
                    console.log('Monthly Income card clicked')
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
                    minWidth: '180px',
                    width: '180px',
                    padding: '16px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0,
                    backgroundColor: '#334155',
                    borderRadius: '16px',
                    border: '1px solid #475569',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleCardClick('/income')}
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
                    minWidth: '180px',
                    width: '180px',
                    padding: '16px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0,
                    backgroundColor: '#334155',
                    borderRadius: '16px',
                    border: '1px solid #475569',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => handleCardClick('/income')}
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
                    {formatCurrency(analytics?.metrics?.net_savings_3m / 3 || 0)}
                  </div>
                </div>
              </div>

              {/* Scroll Indicator Dots */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                gap: '8px', 
                marginTop: '16px' 
              }}>
                {[0, 1, 2].map((_, index) => (
                  <div
                    key={index}
                    className="dashboard-income-dot"
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: index === 0 ? '#22c55e' : 'rgba(255, 255, 255, 0.3)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      transform: index === 0 ? 'scale(1.2)' : 'scale(1)'
                    }}
                    onClick={() => {
                      const scroller = document.getElementById('dashboard-income-scroller')
                      if (scroller) {
                        const scrollWidth = scroller.scrollWidth - scroller.clientWidth
                        const targetScroll = (scrollWidth * index) / 2
                        scroller.scrollTo({ left: targetScroll, behavior: 'smooth' })
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Things To Do */}
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
              Things To Do
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {/* High Priority Task */}
              <div style={{
                ...cardStyle,
                borderLeft: '4px solid #ef4444'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#ef4444' }}>HIGH PRIORITY</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                  Update Emergency Fund
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0' }}>
                  Your emergency fund is below the recommended 6 months of expenses
                </p>
              </div>

              {/* Medium Priority Task */}
              <div style={{
                ...cardStyle,
                borderLeft: '4px solid #f59e0b'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#f59e0b' }}>MEDIUM PRIORITY</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                  Review Investment Portfolio
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0' }}>
                  Consider rebalancing your portfolio for optimal performance
                </p>
              </div>

              {/* Important Task */}
              <div style={{
                ...cardStyle,
                borderLeft: '4px solid #3b82f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#3b82f6' }}>IMPORTANT</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                  Generate Monthly Report
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0' }}>
                  Create a comprehensive financial report for your records
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
              Quick Actions
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px' }}>
              {[
                { title: 'Add Asset', icon: '💰', path: '/wealth', color: '#10b981' },
                { title: 'Add Income', icon: '💵', path: '/income', color: '#22c55e' },
                { title: 'Add Expense', icon: '💳', path: '/income', color: '#ef4444' },
                { title: 'Set Goal', icon: '🎯', path: '/milestones', color: '#ec4899' },
                { title: 'View Reports', icon: '📊', path: '/reports', color: '#3b82f6' }
              ].map((action, index) => (
                <div
                  key={index}
                  style={{
                    ...cardStyle,
                    textAlign: 'center',
                    padding: '20px',
                    borderRadius: '20px'
                  }}
                  onClick={() => handleCardClick(action.path)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                    e.currentTarget.style.borderColor = action.color + '60'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.borderColor = '#334155'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{action.icon}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500', color: action.color }}>
                    {action.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard