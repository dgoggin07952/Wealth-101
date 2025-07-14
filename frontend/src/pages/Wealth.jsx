import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Wealth() {
  const [assets, setAssets] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const { user } = useAuth()

  const [newAsset, setNewAsset] = useState({
    asset_name: '',
    asset_category: 'Cash & Savings',
    asset_type: 'Bank Account',
    ownership_type: 'Individual',
    value: '',
    description: '',
    bank_name: '',
    account_type: 'Current Account',
    interest_rate: ''
  })

  useEffect(() => {
    fetchAssets()
    fetchSummary()
  }, [])

  const fetchAssets = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/assets', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setAssets(response.data)
    } catch (err) {
      console.error('Failed to fetch assets:', err)
      setError('Failed to load assets')
    } finally {
      setLoading(false)
    }
  }

  const fetchSummary = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/assets/summary', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setSummary(response.data)
    } catch (err) {
      console.error('Failed to fetch summary:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/assets', newAsset, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setShowAddForm(false)
      setNewAsset({
        asset_name: '',
        asset_category: 'Cash & Savings',
        asset_type: 'Bank Account',
        ownership_type: 'Individual',
        value: '',
        description: '',
        bank_name: '',
        account_type: 'Current Account',
        interest_rate: ''
      })
      fetchAssets()
      fetchSummary()
    } catch (err) {
      console.error('Failed to add asset:', err)
      setError('Failed to add asset')
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
    transition: 'all 0.3s ease'
  }

  const buttonStyle = {
    background: 'linear-gradient(135deg, #ec4899, #be185d)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    padding: '12px 24px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Filter categories for display (no duplicates)
  const filterCategories = [
    { id: 'all', name: 'All Assets', color: '#94a3b8' },
    { id: 'Cash & Savings', name: 'Cash & Savings', color: '#10b981' },
    { id: 'Stocks & Securities', name: 'Stocks & Securities', color: '#3b82f6' },
    { id: 'Real Estate', name: 'Real Estate', color: '#f59e0b' },
    { id: 'Retirement Accounts', name: 'Retirement', color: '#8b5cf6' },
    { id: 'Business Assets', name: 'Business', color: '#ef4444' },
    { id: 'Other Investments', name: 'Other', color: '#ec4899' }
  ]

  // Category mapping for both display and database formats
  const categoryMapping = {
    'cash_savings': 'Cash & Savings',
    'Cash & Savings': 'Cash & Savings',
    'stocks_securities': 'Stocks & Securities',
    'Stocks & Securities': 'Stocks & Securities',
    'real_estate': 'Real Estate',
    'Real Estate': 'Real Estate',
    'retirement_accounts': 'Retirement',
    'Retirement Accounts': 'Retirement',
    'business_assets': 'Business',
    'Business Assets': 'Business',
    'other_investments': 'Other',
    'Other Investments': 'Other'
  }

  const formatCategoryName = (categoryId) => {
    return categoryMapping[categoryId] || categoryId
  }

  const filteredAssets = selectedCategory === 'all' 
    ? assets 
    : assets.filter(asset => {
        const displayCategory = formatCategoryName(asset.asset_category)
        return displayCategory === selectedCategory
      })

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#94a3b8' }}>Loading wealth data...</div>
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
              Wealth Management
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
                Track and manage your assets and investments
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #be185d, #9f1239)'
                  e.target.style.transform = 'scale(1.05)'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #ec4899, #be185d)'
                  e.target.style.transform = 'scale(1)'
                }}
              >
                Add Asset
              </button>
            </div>
          </div>

          {/* Asset Overview Cards */}
          {summary && (
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '24px',
                padding: '32px',
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.05))'
              }}>
                <div style={{ 
                  display: 'flex', 
                  gap: '16px', 
                  overflowX: 'auto', 
                  paddingBottom: '16px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#475569 #1e293b',
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                  paddingLeft: '8px',
                  paddingRight: '8px'
                }}
                id="wealth-scroller"
                onScroll={(e) => {
                  const scrollLeft = e.target.scrollLeft
                  const scrollWidth = e.target.scrollWidth - e.target.clientWidth
                  const scrollPercentage = scrollLeft / scrollWidth
                  
                  // Update dots based on scroll position
                  const dots = document.querySelectorAll('.wealth-scroll-dot')
                  dots.forEach((dot, index) => {
                    const dotPosition = index / (dots.length - 1)
                    const isActive = Math.abs(scrollPercentage - dotPosition) < 0.15
                    dot.style.backgroundColor = isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.3)'
                    dot.style.transform = isActive ? 'scale(1.2)' : 'scale(1)'
                  })
                }}>
                  {/* Net Worth Overview */}
                  <div style={{ 
                    minWidth: '280px',
                    width: '280px',
                    padding: '24px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: '#22c55e' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0' }}>Net Worth</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22c55e' }}>
                      {formatCurrency(summary.net_worth)}
                    </div>
                  </div>

                  {/* Total Assets */}
                  <div style={{ 
                    minWidth: '280px',
                    width: '280px',
                    padding: '24px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: '#22c55e' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0' }}>Total Assets</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22c55e' }}>
                      {formatCurrency(summary.total_assets)}
                    </div>
                  </div>

                  {/* Total Debts */}
                  <div style={{ 
                    minWidth: '280px',
                    width: '280px',
                    padding: '24px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: '#ef4444' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0' }}>Total Debts</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
                      {formatCurrency(summary.total_debts)}
                    </div>
                  </div>

                  {/* Liquidity */}
                  <div style={{ 
                    minWidth: '280px',
                    width: '280px',
                    padding: '24px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: '#3b82f6' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0' }}>Liquidity</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                      {formatCurrency(summary.total_assets * 0.2)}
                    </div>
                  </div>

                  {/* Cash & Savings Overview */}
                  <div style={{ 
                    minWidth: '280px',
                    width: '280px',
                    padding: '24px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: '#10b981' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0' }}>Cash & Savings</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                      {formatCurrency(summary.total_assets * 0.25)}
                    </div>
                  </div>

                  {/* Investments Overview */}
                  <div style={{ 
                    minWidth: '280px',
                    width: '280px',
                    padding: '24px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: '#8b5cf6' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0' }}>Investments</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>
                      {formatCurrency(summary.total_assets * 0.45)}
                    </div>
                  </div>

                  {/* Property Overview */}
                  <div style={{ 
                    minWidth: '280px',
                    width: '280px',
                    padding: '24px',
                    scrollSnapAlign: 'start',
                    scrollSnapStop: 'always',
                    flexShrink: 0
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        borderRadius: '50%', 
                        backgroundColor: '#f59e0b' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#e2e8f0' }}>Property</span>
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                      {formatCurrency(summary.total_assets * 0.3)}
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
                <div className="wealth-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: '#22c55e', 
                  transition: 'all 0.3s ease',
                  transform: 'scale(1.2)'
                }}></div>
                <div className="wealth-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
                <div className="wealth-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
                <div className="wealth-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
                <div className="wealth-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
                <div className="wealth-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
                <div className="wealth-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
              </div>
            </div>
          )}

          {/* Category Filter */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {filterCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: selectedCategory === category.id ? `2px solid ${category.color}` : '1px solid #334155',
                    backgroundColor: selectedCategory === category.id ? `${category.color}20` : '#1e293b',
                    color: selectedCategory === category.id ? category.color : '#94a3b8',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedCategory !== category.id) {
                      e.target.style.backgroundColor = '#334155'
                      e.target.style.color = 'white'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedCategory !== category.id) {
                      e.target.style.backgroundColor = '#1e293b'
                      e.target.style.color = '#94a3b8'
                    }
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Assets List */}
          {filteredAssets.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>💰</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                No Assets Found
              </h3>
              <p style={{ color: '#94a3b8', margin: '0 0 24px 0' }}>
                {selectedCategory === 'all' 
                  ? "You haven't added any assets yet. Click 'Add Asset' to get started."
                  : `No assets found in the ${selectedCategory} category.`}
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                style={buttonStyle}
              >
                Add Your First Asset
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredAssets.map((asset) => {
                const displayCategory = formatCategoryName(asset.asset_category)
                const category = filterCategories.find(c => c.name === displayCategory) || filterCategories[0]
                return (
                  <div
                    key={asset.id}
                    style={{
                      ...cardStyle,
                      cursor: 'pointer',
                      borderColor: `${category.color}40`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      minHeight: '70px'
                    }}
                    onClick={() => setSelectedAsset(asset)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.01)'
                      e.currentTarget.style.borderColor = `${category.color}80`
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)'
                      e.currentTarget.style.borderColor = `${category.color}40`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <div style={{ 
                        width: '10px', 
                        height: '10px', 
                        borderRadius: '50%', 
                        backgroundColor: category.color,
                        flexShrink: 0
                      }}></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{ 
                          fontSize: '1.125rem', 
                          fontWeight: '600', 
                          color: 'white', 
                          margin: '0 0 4px 0',
                          lineHeight: '1.3'
                        }}>
                          {asset.asset_name}
                        </h3>
                        <div style={{ 
                          fontSize: '0.875rem',
                          color: '#94a3b8',
                          lineHeight: '1.2'
                        }}>
                          {asset.asset_type}
                        </div>
                      </div>
                    </div>
                    
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'flex-end',
                      flexShrink: 0 
                    }}>
                      <div style={{ 
                        fontSize: '1.25rem', 
                        fontWeight: '700', 
                        color: category.color, 
                        textAlign: 'right',
                        whiteSpace: 'nowrap'
                      }}>
                        {formatCurrency(asset.value)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Asset Modal */}
      {showAddForm && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            borderRadius: '24px', 
            padding: '24px', 
            width: '100%', 
            maxWidth: '600px',
            border: '1px solid #334155',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', margin: '0' }}>Add New Asset</h2>
              <button
                onClick={() => setShowAddForm(false)}
                style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  color: '#94a3b8', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '6px' }}>
                  Asset Name
                </label>
                <input
                  type="text"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="e.g., Santander Current Account"
                  value={newAsset.asset_name}
                  onChange={(e) => setNewAsset({...newAsset, asset_name: e.target.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  value={newAsset.asset_category}
                  onChange={(e) => setNewAsset({...newAsset, asset_category: e.target.value})}
                >
                  <option value="Cash & Savings">Cash & Savings</option>
                  <option value="Stocks & Securities">Stocks & Securities</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Retirement Accounts">Retirement Accounts</option>
                  <option value="Business Assets">Business Assets</option>
                  <option value="Other Investments">Other Investments</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '6px' }}>
                  Value (£)
                </label>
                <input
                  type="number"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '1rem',
                    boxSizing: 'border-box'
                  }}
                  placeholder="10000"
                  value={newAsset.value}
                  onChange={(e) => setNewAsset({...newAsset, value: e.target.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '6px' }}>
                  Description (Optional)
                </label>
                <textarea
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '1rem',
                    minHeight: '60px',
                    resize: 'vertical',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Additional details about this asset..."
                  value={newAsset.description}
                  onChange={(e) => setNewAsset({...newAsset, description: e.target.value})}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{ 
                    flex: 1, 
                    padding: '12px 24px', 
                    backgroundColor: '#475569', 
                    color: '#e2e8f0', 
                    borderRadius: '16px', 
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ 
                    flex: 1, 
                    padding: '12px 24px', 
                    background: 'linear-gradient(135deg, #ec4899, #be185d)', 
                    color: 'white', 
                    borderRadius: '16px', 
                    border: 'none',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Add Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          zIndex: 50,
          padding: '16px'
        }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            borderRadius: '24px', 
            padding: '32px', 
            maxWidth: '500px', 
            width: '100%', 
            border: '1px solid #334155'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: '0' }}>
                {selectedAsset.asset_name}
              </h2>
              <button
                onClick={() => setSelectedAsset(null)}
                style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none', 
                  color: '#94a3b8', 
                  fontSize: '1.5rem', 
                  cursor: 'pointer',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Category</span>
                <span style={{ color: '#e2e8f0' }}>{selectedAsset.asset_category}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Type</span>
                <span style={{ color: '#e2e8f0' }}>{selectedAsset.asset_type}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Value</span>
                <span style={{ color: '#10b981', fontWeight: '600', fontSize: '1.125rem' }}>
                  {formatCurrency(selectedAsset.value)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b' }}>Ownership</span>
                <span style={{ color: '#e2e8f0' }}>{selectedAsset.ownership_type}</span>
              </div>
              {selectedAsset.description && (
                <div>
                  <span style={{ color: '#64748b', display: 'block', marginBottom: '8px' }}>Description</span>
                  <p style={{ color: '#e2e8f0', margin: '0', fontStyle: 'italic' }}>
                    {selectedAsset.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}