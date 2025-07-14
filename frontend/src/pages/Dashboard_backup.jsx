import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Dashboard() {
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

  const pageStyle = {
    backgroundColor: '#0f172a',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    minHeight: '100vh',
    width: '100%',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }

  const cardStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '16px',
    padding: '24px',
    color: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  }

  const handleCardClick = (path) => {
    navigate(path)
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

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#94a3b8' }}>Loading dashboard...</div>
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
      {/* Header */}
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

          {/* Scrollable Asset Breakdown */}
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '24px',
              padding: '32px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.05))'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
                Asset Breakdown
              </h3>
              
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                overflowX: 'auto', 
                paddingBottom: '16px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#475569 #1e293b',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch',
                cursor: 'grab'
              }} 
              id="dashboard-asset-scroller"
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft
                const scrollWidth = e.target.scrollWidth - e.target.clientWidth
                const scrollPercentage = scrollLeft / scrollWidth
                
                // Update dots based on scroll position
                const dots = document.querySelectorAll('.dashboard-scroll-dot')
                dots.forEach((dot, index) => {
                  const dotPosition = index / (dots.length - 1)
                  const isActive = Math.abs(scrollPercentage - dotPosition) < 0.3
                  dot.style.backgroundColor = isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.3)'
                  dot.style.transform = isActive ? 'scale(1.2)' : 'scale(1)'
                })
              }}>
                {/* Net Worth Overview */}
                <div style={{ 
                  minWidth: '180px',
                  width: '180px',
                  padding: '16px',
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  flexShrink: 0
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
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
                <div style={{ 
                  minWidth: '180px',
                  width: '180px',
                  padding: '16px',
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  flexShrink: 0
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#22c55e' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Gross Assets</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#22c55e', marginBottom: '12px' }}>
                    {formatCurrency((analytics?.metrics?.current_wealth || 0) + 150000)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Cash & Savings</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(85000)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Investments</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(165000)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Property</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(150000)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total Debt */}
                <div style={{ 
                  minWidth: '180px',
                  width: '180px',
                  padding: '16px',
                  scrollSnapAlign: 'start',
                  scrollSnapStop: 'always',
                  flexShrink: 0
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ef4444' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Total Debt</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444', marginBottom: '12px' }}>
                    {formatCurrency(150000)} {/* Mock debt amount */}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Mortgage</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(135000)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Credit Cards</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(8500)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Loans</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(6500)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Emergency Fund */}
                <div style={{ 
                  minWidth: '180px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#a855f7' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Emergency Fund</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#a855f7', marginBottom: '12px' }}>
                    {analytics?.metrics?.emergency_fund_months?.toFixed(1) || '0.0'} months
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Target</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>6 months</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Amount</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(25000)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Progress</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {Math.min(100, ((analytics?.metrics?.emergency_fund_months || 0) / 6) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator Dots */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '8px', 
                marginTop: '16px',
                marginBottom: '16px'
              }}>
                <div className="dashboard-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: '#22c55e', 
                  transition: 'all 0.3s ease',
                  transform: 'scale(1.2)'
                }}></div>
                <div className="dashboard-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
                <div className="dashboard-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
              </div>

              {/* Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '24px' 
              }}>
                <button
                  onClick={() => handleCardClick('/wealth')}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #16a34a, #15803d)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  + Add Asset
                </button>
                <button
                  onClick={() => handleCardClick('/wealth')}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  + Add Debt
                </button>
                <button
                  onClick={() => handleCardClick('/wealth')}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Income & Expenses */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
              Income & Expenses
            </h2>
            
            {/* Income & Expenses Card */}
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '24px',
              padding: '32px',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.05))'
            }}>
              {/* Scrollable Income & Expenses */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                overflowX: 'auto', 
                paddingBottom: '16px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#475569 #1e293b'
              }}>
                {/* Income Card */}
                <div style={{ 
                  minWidth: '180px',
                  padding: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => handleCardClick('/income')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#22c55e' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Monthly Income</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#22c55e', marginBottom: '12px' }}>
                    {formatCurrency((analytics?.metrics?.total_income_3m || 0) / 3)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Salary</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(((analytics?.metrics?.total_income_3m || 0) / 3) * 0.8)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Freelance</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(((analytics?.metrics?.total_income_3m || 0) / 3) * 0.15)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Other</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(((analytics?.metrics?.total_income_3m || 0) / 3) * 0.05)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expenses Card */}
                <div style={{ 
                  minWidth: '180px',
                  padding: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => handleCardClick('/income')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ef4444' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Monthly Expenses</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444', marginBottom: '12px' }}>
                    {formatCurrency((analytics?.metrics?.total_expenses_3m || 0) / 3)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Housing</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(((analytics?.metrics?.total_expenses_3m || 0) / 3) * 0.4)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Food & Dining</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(((analytics?.metrics?.total_expenses_3m || 0) / 3) * 0.25)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Other</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(((analytics?.metrics?.total_expenses_3m || 0) / 3) * 0.35)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Savings Card */}
                <div style={{ 
                  minWidth: '180px',
                  padding: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => handleCardClick('/income')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#f59e0b' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Net Savings</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#f59e0b', marginBottom: '12px' }}>
                    {formatCurrency((analytics?.metrics?.net_savings_3m || 0) / 3)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Savings Rate</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {((analytics?.metrics?.net_savings_3m || 0) / (analytics?.metrics?.total_income_3m || 1) * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Target</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>20%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>3-Month Total</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(analytics?.metrics?.net_savings_3m || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Income & Expenses Action Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '12px', 
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '24px' 
              }}>
                <button
                  onClick={() => handleCardClick('/income')}
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #16a34a, #15803d)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  + Add Income
                </button>
                <button
                  onClick={() => handleCardClick('/income')}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #dc2626, #b91c1c)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  + Add Expense
                </button>
                <button
                  onClick={() => handleCardClick('/income')}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '12px 24px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '0.875rem'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #d97706, #b45309)'
                    e.target.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)'
                    e.target.style.transform = 'scale(1)'
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>

          {/* Things To Do */}
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
              Things To Do
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <div 
                style={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(190, 24, 93, 0.15))',
                  border: '1px solid rgba(236, 72, 153, 0.2)'
                }}
                onClick={() => handleCardClick('/insurance')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = 'rgba(236, 72, 153, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#ef4444', 
                    marginRight: '12px' 
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#ef4444' }}>HIGH PRIORITY</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                  Set Up Income Protection
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0' }}>
                  Protect your ability to earn with income protection insurance
                </p>
              </div>

              <div 
                style={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15), rgba(124, 58, 237, 0.15))',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}
                onClick={() => handleCardClick('/milestones')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#f59e0b', 
                    marginRight: '12px' 
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#f59e0b' }}>MEDIUM PRIORITY</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                  Review Financial Goals
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0' }}>
                  Update your financial milestones and savings targets
                </p>
              </div>

              <div 
                style={{
                  ...cardStyle,
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(29, 78, 216, 0.15))',
                  border: '1px solid rgba(59, 130, 246, 0.2)'
                }}
                onClick={() => handleCardClick('/reports')}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    borderRadius: '50%', 
                    backgroundColor: '#3b82f6', 
                    marginRight: '12px' 
                  }}></div>
                  <span style={{ fontSize: '0.75rem', fontWeight: '600', color: '#3b82f6' }}>IMPORTANT</span>
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                  Generate Quarterly Report
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