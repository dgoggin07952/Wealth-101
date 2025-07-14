import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Milestones() {
  const [milestones, setMilestones] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const { user } = useAuth()

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    description: '',
    category: 'Savings',
    target_amount: '',
    target_date: '',
    current_amount: '0'
  })

  useEffect(() => {
    fetchMilestones()
  }, [])

  const fetchMilestones = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/milestones', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setMilestones(response.data)
    } catch (err) {
      console.error('Failed to fetch milestones:', err)
      setError('Failed to load milestones')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      await axios.post('/api/milestones', newMilestone, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setShowAddForm(false)
      setNewMilestone({
        title: '',
        description: '',
        category: 'Savings',
        target_amount: '',
        target_date: '',
        current_amount: '0'
      })
      fetchMilestones()
    } catch (err) {
      console.error('Failed to add milestone:', err)
      setError('Failed to add milestone')
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

  const categories = [
    { id: 'Savings', name: 'Savings', color: '#10b981', icon: '💰' },
    { id: 'Investment', name: 'Investment', color: '#3b82f6', icon: '📈' },
    { id: 'Property', name: 'Property', color: '#f59e0b', icon: '🏠' },
    { id: 'Retirement', name: 'Retirement', color: '#8b5cf6', icon: '🏖️' },
    { id: 'Education', name: 'Education', color: '#ec4899', icon: '🎓' },
    { id: 'Travel', name: 'Travel', color: '#06b6d4', icon: '✈️' },
    { id: 'Emergency', name: 'Emergency Fund', color: '#ef4444', icon: '🚨' },
    { id: 'Other', name: 'Other', color: '#64748b', icon: '🎯' }
  ]

  const getDaysToTarget = (targetDate) => {
    const target = new Date(targetDate)
    const today = new Date()
    const diffTime = target - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getProgressColor = (percentage) => {
    if (percentage >= 100) return '#10b981'
    if (percentage >= 75) return '#22c55e'
    if (percentage >= 50) return '#f59e0b'
    if (percentage >= 25) return '#f97316'
    return '#ef4444'
  }

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#94a3b8' }}>Loading milestones...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
              Goals & Projections
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
              Set and track your financial goals, milestones, and future projections
            </p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '32px' }}>
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
              Add Milestone
            </button>
          </div>

          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
            <div style={cardStyle}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                {milestones.filter(m => m.is_completed).length}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Completed Goals</div>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                {milestones.filter(m => !m.is_completed).length}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Active Goals</div>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ec4899', marginBottom: '4px' }}>
                {formatCurrency(milestones.reduce((sum, m) => sum + m.target_amount, 0))}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total Target</div>
            </div>
            <div style={cardStyle}>
              <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                {formatCurrency(milestones.reduce((sum, m) => sum + m.current_amount, 0))}
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total Progress</div>
            </div>
          </div>

          {/* Milestones List */}
          {milestones.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🎯</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                No Milestones Set
              </h3>
              <p style={{ color: '#94a3b8', margin: '0 0 24px 0' }}>
                Start by setting your first financial goal to track your progress towards financial freedom.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                style={buttonStyle}
              >
                Set Your First Goal
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
              {milestones.map((milestone) => {
                const category = categories.find(c => c.id === milestone.category) || categories[0]
                const daysToTarget = getDaysToTarget(milestone.target_date)
                const progressColor = getProgressColor(milestone.progress_percentage)
                
                return (
                  <div
                    key={milestone.id}
                    style={{
                      ...cardStyle,
                      borderRadius: '24px',
                      borderColor: `${category.color}40`,
                      background: `linear-gradient(135deg, rgba(${category.color === '#10b981' ? '16, 185, 129' : category.color === '#3b82f6' ? '59, 130, 246' : category.color === '#f59e0b' ? '245, 158, 11' : category.color === '#8b5cf6' ? '139, 92, 246' : category.color === '#ec4899' ? '236, 72, 153' : category.color === '#06b6d4' ? '6, 182, 212' : category.color === '#ef4444' ? '239, 68, 68' : '100, 116, 139'}, 0.1), rgba(${category.color === '#10b981' ? '16, 185, 129' : category.color === '#3b82f6' ? '59, 130, 246' : category.color === '#f59e0b' ? '245, 158, 11' : category.color === '#8b5cf6' ? '139, 92, 246' : category.color === '#ec4899' ? '236, 72, 153' : category.color === '#06b6d4' ? '6, 182, 212' : category.color === '#ef4444' ? '239, 68, 68' : '100, 116, 139'}, 0.05))`
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '12px', 
                          backgroundColor: `${category.color}20`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem'
                        }}>
                          {category.icon}
                        </div>
                        <div>
                          <div style={{ 
                            padding: '4px 8px', 
                            borderRadius: '8px', 
                            backgroundColor: `${category.color}20`,
                            color: category.color,
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}>
                            {category.name}
                          </div>
                        </div>
                      </div>
                      
                      {milestone.is_completed && (
                        <div style={{ 
                          padding: '4px 8px', 
                          borderRadius: '8px', 
                          backgroundColor: 'rgba(16, 185, 129, 0.2)',
                          color: '#10b981',
                          fontSize: '0.75rem',
                          fontWeight: '600'
                        }}>
                          COMPLETED
                        </div>
                      )}
                    </div>

                    {/* Title and Description */}
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                      {milestone.title}
                    </h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 20px 0', lineHeight: '1.5' }}>
                      {milestone.description}
                    </p>

                    {/* Progress */}
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Progress</span>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: progressColor }}>
                          {milestone.progress_percentage.toFixed(1)}%
                        </span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: '#334155', 
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${Math.min(milestone.progress_percentage, 100)}%`, 
                          height: '100%', 
                          backgroundColor: progressColor,
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>

                    {/* Financial Details */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Current</span>
                        <span style={{ fontWeight: '600', color: '#e2e8f0', fontSize: '0.875rem' }}>
                          {formatCurrency(milestone.current_amount)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Target</span>
                        <span style={{ fontWeight: '600', color: category.color, fontSize: '0.875rem' }}>
                          {formatCurrency(milestone.target_amount)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Remaining</span>
                        <span style={{ fontWeight: '600', color: '#f87171', fontSize: '0.875rem' }}>
                          {formatCurrency(Math.max(0, milestone.target_amount - milestone.current_amount))}
                        </span>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid #334155' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Target Date</div>
                        <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0' }}>
                          {new Date(milestone.target_date).toLocaleDateString('en-GB')}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Days Left</div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '500', 
                          color: daysToTarget > 0 ? (daysToTarget > 30 ? '#10b981' : '#f59e0b') : '#ef4444'
                        }}>
                          {daysToTarget > 0 ? `${daysToTarget} days` : 'Overdue'}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Milestone Modal */}
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
            padding: '32px', 
            maxWidth: '500px', 
            width: '100%', 
            border: '1px solid #334155',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: '0' }}>Add Financial Goal</h2>
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
                  Goal Title
                </label>
                <input
                  type="text"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '16px', 
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="e.g., Emergency Fund"
                  value={newMilestone.title}
                  onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Category
                </label>
                <select
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '16px', 
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  value={newMilestone.category}
                  onChange={(e) => setNewMilestone({...newMilestone, category: e.target.value})}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Target Amount (£)
                </label>
                <input
                  type="number"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '16px', 
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  placeholder="10000"
                  value={newMilestone.target_amount}
                  onChange={(e) => setNewMilestone({...newMilestone, target_amount: e.target.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Target Date
                </label>
                <input
                  type="date"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '16px', 
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  value={newMilestone.target_date}
                  onChange={(e) => setNewMilestone({...newMilestone, target_date: e.target.value})}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Description
                </label>
                <textarea
                  style={{ 
                    width: '100%', 
                    padding: '16px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '16px', 
                    color: 'white',
                    fontSize: '1rem',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                  placeholder="Describe your financial goal..."
                  value={newMilestone.description}
                  onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
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
                  Add Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}