import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Insurance() {
  const [showAddForm, setShowAddForm] = useState(false)
  const [selectedType, setSelectedType] = useState('income')
  const [policies, setPolicies] = useState([])
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newPolicy, setNewPolicy] = useState({
    policy_type: 'income',
    provider: '',
    coverage_amount: '',
    monthly_premium: ''
  })

  useEffect(() => {
    loadInsuranceData()
  }, [])

  const loadInsuranceData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      
      const config = { headers: { Authorization: `Bearer ${token}` } }
      
      const [policiesResponse, summaryResponse] = await Promise.all([
        axios.get('/api/insurance', config),
        axios.get('/api/insurance/summary', config)
      ])
      
      setPolicies(policiesResponse.data)
      setSummary(summaryResponse.data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading insurance data:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      if (!token) return
      
      const config = { headers: { Authorization: `Bearer ${token}` } }
      
      await axios.post('/api/insurance', {
        policy_type: newPolicy.policy_type,
        provider: newPolicy.provider,
        coverage_amount: parseFloat(newPolicy.coverage_amount),
        monthly_premium: parseFloat(newPolicy.monthly_premium)
      }, config)
      
      setShowAddForm(false)
      setNewPolicy({
        policy_type: 'income',
        provider: '',
        coverage_amount: '',
        monthly_premium: ''
      })
      
      // Reload data
      loadInsuranceData()
    } catch (error) {
      console.error('Error adding policy:', error)
    }
  }

  const cardStyle = {
    backgroundColor: '#1e293b',
    border: '1px solid #334155',
    borderRadius: '16px',
    padding: '24px',
    color: 'white'
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

  const pageStyle = {
    backgroundColor: '#0f172a',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    minHeight: '100vh',
    width: '100%',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  }

  const getInsuranceTypes = () => {
    const targets = { income: 3750, inheritance: 100000, family: 500000 }
    const current = summary?.coverage_by_type || {}
    const breakdown = summary?.coverage_breakdown || {}
    
    return [
      {
        id: 'income',
        title: 'Income Protection',
        description: 'Cover you families income if you lose your job or can\'t work',
        icon: '💼',
        current: current.income || 0,
        target: targets.income,
        percentage: Math.round(breakdown.income_percentage || 0),
        priority: 'High'
      },
      {
        id: 'inheritance',
        title: 'Inheritance Tax Cover',
        description: 'Protect your estate from tax liabilities or gift money to your loved ones',
        icon: '🏛️',
        current: current.inheritance || 0,
        target: targets.inheritance,
        percentage: Math.round(breakdown.inheritance_percentage || 0),
        priority: 'Medium'
      },
      {
        id: 'family',
        title: 'Family Protection',
        description: 'Cover your families expense if you die',
        icon: '👨‍👩‍👧‍👦',
        current: current.family || 0,
        target: targets.family,
        percentage: Math.round(breakdown.family_percentage || 0),
        priority: 'Important'
      }
    ]
  }

  const insuranceTypes = getInsuranceTypes()

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
              Insurance
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
                Protect your wealth, income, and family's future
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
                Add Insurance Policy
              </button>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={cardStyle}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                {summary ? Math.round(summary.coverage_percentage) : '0'}%
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Coverage Complete</div>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f87171', marginBottom: '4px' }}>
                {summary ? Math.round(summary.protection_gap) : '0'}%
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Protection Gap</div>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#60a5fa', marginBottom: '4px' }}>
                £{summary ? Math.round(summary.total_monthly_premium).toLocaleString() : '0'}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Monthly Premium</div>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#a78bfa', marginBottom: '4px' }}>
                {summary ? summary.total_policies : 0}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Active Policies</div>
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Cards */}
      <div style={{ padding: '0 24px 32px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {insuranceTypes.map((type) => (
              <div
                key={type.id}
                onClick={() => { setSelectedType(type.id); setShowAddForm(true); }}
                style={{
                  ...cardStyle,
                  cursor: 'pointer',
                  borderRadius: '24px',
                  transition: 'all 0.3s ease',
                  ':hover': {
                    transform: 'scale(1.02)',
                    borderColor: '#475569'
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.02)'
                  e.target.style.borderColor = '#475569'
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)'
                  e.target.style.borderColor = '#334155'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <div style={{ 
                    width: '56px', 
                    height: '56px', 
                    borderRadius: '16px', 
                    background: type.id === 'income' ? 'linear-gradient(135deg, #ec4899, #be185d)' : 
                               type.id === 'inheritance' ? 'linear-gradient(135deg, #8b5cf6, #7c3aed)' : 
                               'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>
                    {type.icon}
                  </div>
                  <div style={{ 
                    padding: '4px 12px', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: '600',
                    backgroundColor: type.priority === 'High' ? '#fecaca' : type.priority === 'Medium' ? '#fef3c7' : '#dbeafe',
                    color: type.priority === 'High' ? '#991b1b' : type.priority === 'Medium' ? '#92400e' : '#1e40af'
                  }}>
                    {type.priority}
                  </div>
                </div>
                
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 12px 0' }}>
                  {type.title}
                </h3>
                <p style={{ color: '#94a3b8', margin: '0 0 24px 0', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {type.description}
                </p>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Current</span>
                    <span style={{ fontWeight: '500', color: '#e2e8f0' }}>
                      {type.id === 'income' ? `£${type.current}/month` : `£${type.current.toLocaleString()}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Target</span>
                    <span style={{ fontWeight: '500', color: '#e2e8f0' }}>
                      {type.id === 'income' ? `£${type.target.toLocaleString()}/month` : `£${type.target.toLocaleString()}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Coverage</span>
                    <span style={{ fontWeight: '500', color: type.percentage >= 100 ? '#10b981' : type.percentage >= 50 ? '#f59e0b' : '#f87171' }}>
                      {type.percentage}% Complete
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Active Policies Section */}
          {policies.length > 0 && (
            <div style={{ marginBottom: '32px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', marginBottom: '16px' }}>
                Active Policies
              </h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                {policies.map((policy) => (
                  <div key={policy.id} style={{ ...cardStyle, borderRadius: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <div style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white' }}>
                            {policy.policy_type === 'income' ? 'Income Protection' : 
                             policy.policy_type === 'family' ? 'Family Protection' : 
                             'Inheritance Tax Cover'}
                          </div>
                          <div style={{ 
                            backgroundColor: '#22c55e', 
                            color: 'white', 
                            padding: '2px 8px', 
                            borderRadius: '6px', 
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            Active
                          </div>
                        </div>
                        <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '12px' }}>
                          Provider: {policy.provider}
                        </div>
                        <div style={{ display: 'flex', gap: '24px' }}>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                              {policy.policy_type === 'income' || policy.policy_type === 'family' ? 'Monthly Payout' : 'Coverage Amount'}
                            </div>
                            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#34d399' }}>
                              £{policy.coverage_amount.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>Monthly Premium</div>
                            <div style={{ fontSize: '1.125rem', fontWeight: '600', color: '#60a5fa' }}>
                              £{policy.monthly_premium.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Section */}
          <div style={{ ...cardStyle, borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: '0 0 24px 0' }}>Why Insurance Matters</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>Protection Priorities</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {[
                    { color: '#f87171', title: 'Income Protection', desc: 'Essential if you work - protects your ability to earn' },
                    { color: '#fbbf24', title: 'Inheritance Tax Cover', desc: 'Protects your estate from tax liabilities' },
                    { color: '#60a5fa', title: 'Family Protection', desc: 'Secures your family\'s financial future' }
                  ].map((item, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color, marginTop: '8px', flexShrink: 0 }}></div>
                      <div>
                        <p style={{ fontWeight: '500', color: 'white', margin: '0 0 4px 0' }}>{item.title}</p>
                        <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>Next Steps</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div 
                    onClick={() => alert('Quote request feature coming soon - we\'ll connect you with insurance experts!')}
                    style={{ 
                      padding: '16px', 
                      background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(190, 24, 93, 0.1))', 
                      borderRadius: '16px', 
                      border: '1px solid rgba(236, 72, 153, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(190, 24, 93, 0.2))'
                      e.target.style.transform = 'scale(1.02)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, rgba(236, 72, 153, 0.1), rgba(190, 24, 93, 0.1))'
                      e.target.style.transform = 'scale(1)'
                    }}
                  >
                    <p style={{ fontWeight: '500', color: '#f9a8d4', margin: '0 0 4px 0' }}>Get Quote from Expert</p>
                    <p style={{ color: '#f3e8ff', fontSize: '0.875rem', margin: '0' }}>We can arrange for an insurance firm to call you with personalized quotes</p>
                  </div>
                  <div style={{ padding: '16px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1))', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <p style={{ fontWeight: '500', color: '#93c5fd', margin: '0 0 4px 0' }}>Regular Reviews</p>
                    <p style={{ color: '#e0e7ff', fontSize: '0.875rem', margin: '0' }}>Review annually or after major life events</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Policy Modal */}
      {showAddForm && (
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0, 0, 0, 0.6)', 
          display: 'flex', 
          alignItems: 'flex-start', 
          justifyContent: 'center', 
          zIndex: 50,
          padding: '16px',
          overflowY: 'auto',
          paddingTop: '5vh'
        }}>
          <div style={{ 
            backgroundColor: '#1e293b', 
            borderRadius: '24px', 
            padding: '24px', 
            maxWidth: '400px', 
            width: '100%', 
            border: '1px solid #334155',
            maxHeight: '90vh',
            overflowY: 'auto',
            margin: '0 auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'white', margin: '0' }}>Add Insurance Policy</h2>
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
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Policy Type
                </label>
                <select
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  value={selectedType}
                  onChange={(e) => {
                    setSelectedType(e.target.value)
                    setNewPolicy({...newPolicy, policy_type: e.target.value})
                  }}
                >
                  <option value="income">Income Protection</option>
                  <option value="inheritance">Inheritance Tax Cover</option>
                  <option value="family">Family Protection</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Insurance Provider
                </label>
                <input
                  type="text"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="e.g., Aviva, AIG, Legal & General"
                  value={newPolicy.provider}
                  onChange={(e) => setNewPolicy({...newPolicy, provider: e.target.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  {selectedType === 'income' || selectedType === 'family' ? 'Monthly Payout (£)' : 'Coverage Amount (£)'}
                </label>
                <input
                  type="number"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder={selectedType === 'income' || selectedType === 'family' ? '3000' : '100000'}
                  value={newPolicy.coverage_amount}
                  onChange={(e) => setNewPolicy({...newPolicy, coverage_amount: e.target.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Monthly Premium (£)
                </label>
                <input
                  type="number"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '0.9rem'
                  }}
                  placeholder="50"
                  value={newPolicy.monthly_premium}
                  onChange={(e) => setNewPolicy({...newPolicy, monthly_premium: e.target.value})}
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
                  Add Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}