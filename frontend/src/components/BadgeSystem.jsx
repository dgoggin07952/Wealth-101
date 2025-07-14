import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const BadgeSystem = () => {
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchBadges()
  }, [])

  const fetchBadges = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/badges', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setBadges(response.data)
    } catch (err) {
      console.error('Failed to fetch badges:', err)
    } finally {
      setLoading(false)
    }
  }

  const badgeDefinitions = [
    // Getting Started Badges
    {
      id: 'first_login',
      name: 'Welcome Aboard',
      description: 'Complete your first login',
      icon: '🎉',
      color: '#22c55e',
      rarity: 'common',
      percentile: 100
    },
    {
      id: 'wealth_tracker',
      name: 'Wealth Tracker',
      description: 'Add your first asset',
      icon: '💰',
      color: '#3b82f6',
      rarity: 'common',
      percentile: 85
    },
    {
      id: 'goal_setter',
      name: 'Goal Setter',
      description: 'Set your first financial milestone',
      icon: '🎯',
      color: '#8b5cf6',
      rarity: 'common',
      percentile: 75
    },
    {
      id: 'profile_complete',
      name: 'Profile Master',
      description: 'Complete your profile information',
      icon: '👤',
      color: '#06b6d4',
      rarity: 'common',
      percentile: 70
    },
    
    // Engagement Badges
    {
      id: 'consistent_user',
      name: 'Consistent User',
      description: 'Login 7 days in a row',
      icon: '🔥',
      color: '#ef4444',
      rarity: 'uncommon',
      percentile: 45
    },
    {
      id: 'monthly_champion',
      name: 'Monthly Champion',
      description: 'Login 30 days in a row',
      icon: '⭐',
      color: '#f59e0b',
      rarity: 'rare',
      percentile: 15
    },
    {
      id: 'yearly_legend',
      name: 'Yearly Legend',
      description: 'Login 365 days in a row',
      icon: '👑',
      color: '#ec4899',
      rarity: 'legendary',
      percentile: 1
    },
    {
      id: 'early_bird',
      name: 'Early Bird',
      description: 'Login before 8 AM 10 times',
      icon: '🌅',
      color: '#84cc16',
      rarity: 'uncommon',
      percentile: 35
    },
    {
      id: 'night_owl',
      name: 'Night Owl',
      description: 'Login after 10 PM 10 times',
      icon: '🌙',
      color: '#6366f1',
      rarity: 'uncommon',
      percentile: 40
    },
    
    // Financial Achievement Badges
    {
      id: 'first_10k',
      name: 'Five Figure Club',
      description: 'Reach £10,000 net worth',
      icon: '💸',
      color: '#10b981',
      rarity: 'uncommon',
      percentile: 55
    },
    {
      id: 'first_100k',
      name: 'Six Figure Club',
      description: 'Reach £100,000 net worth',
      icon: '💰',
      color: '#059669',
      rarity: 'rare',
      percentile: 25
    },
    {
      id: 'half_million',
      name: 'Half Million Hero',
      description: 'Reach £500,000 net worth',
      icon: '💎',
      color: '#7c3aed',
      rarity: 'epic',
      percentile: 8
    },
    {
      id: 'millionaire',
      name: 'Millionaire',
      description: 'Reach £1,000,000 net worth',
      icon: '🏆',
      color: '#ec4899',
      rarity: 'legendary',
      percentile: 3
    },
    {
      id: 'multi_millionaire',
      name: 'Multi-Millionaire',
      description: 'Reach £5,000,000 net worth',
      icon: '💫',
      color: '#f59e0b',
      rarity: 'legendary',
      percentile: 0.5
    },
    
    // Portfolio Badges
    {
      id: 'diversified_portfolio',
      name: 'Diversified Portfolio',
      description: 'Have assets in 5 different categories',
      icon: '📊',
      color: '#f59e0b',
      rarity: 'rare',
      percentile: 30
    },
    {
      id: 'property_investor',
      name: 'Property Investor',
      description: 'Own 3 or more properties',
      icon: '🏠',
      color: '#14b8a6',
      rarity: 'rare',
      percentile: 12
    },
    {
      id: 'stock_trader',
      name: 'Stock Trader',
      description: 'Hold 10 different stocks',
      icon: '📈',
      color: '#3b82f6',
      rarity: 'uncommon',
      percentile: 40
    },
    {
      id: 'crypto_enthusiast',
      name: 'Crypto Enthusiast',
      description: 'Hold 5 different cryptocurrencies',
      icon: '₿',
      color: '#f59e0b',
      rarity: 'uncommon',
      percentile: 25
    },
    
    // Savings & Planning Badges
    {
      id: 'emergency_fund',
      name: 'Emergency Ready',
      description: 'Build 6 months emergency fund',
      icon: '🛡️',
      color: '#10b981',
      rarity: 'uncommon',
      percentile: 35
    },
    {
      id: 'savings_master',
      name: 'Savings Master',
      description: 'Save 20% of income for 6 months',
      icon: '🏦',
      color: '#059669',
      rarity: 'rare',
      percentile: 20
    },
    {
      id: 'debt_free',
      name: 'Debt Free',
      description: 'Eliminate all consumer debt',
      icon: '🎊',
      color: '#22c55e',
      rarity: 'rare',
      percentile: 15
    },
    {
      id: 'budget_master',
      name: 'Budget Master',
      description: 'Track expenses for 90 days',
      icon: '📝',
      color: '#8b5cf6',
      rarity: 'uncommon',
      percentile: 45
    },
    
    // Activity Badges
    {
      id: 'report_generator',
      name: 'Report Generator',
      description: 'Generate your first financial report',
      icon: '📋',
      color: '#6366f1',
      rarity: 'uncommon',
      percentile: 50
    },
    {
      id: 'data_analyst',
      name: 'Data Analyst',
      description: 'Generate 10 different reports',
      icon: '📊',
      color: '#7c3aed',
      rarity: 'rare',
      percentile: 18
    },
    {
      id: 'milestone_achiever',
      name: 'Milestone Achiever',
      description: 'Complete 5 financial milestones',
      icon: '🎯',
      color: '#ef4444',
      rarity: 'rare',
      percentile: 22
    },
    {
      id: 'task_master',
      name: 'Task Master',
      description: 'Complete 25 daily tasks',
      icon: '✅',
      color: '#10b981',
      rarity: 'uncommon',
      percentile: 38
    },
    
    // Special Achievement Badges
    {
      id: 'market_survivor',
      name: 'Market Survivor',
      description: 'Maintain positive growth during market downturn',
      icon: '📉',
      color: '#ef4444',
      rarity: 'epic',
      percentile: 10
    },
    {
      id: 'early_adopter',
      name: 'Early Adopter',
      description: 'Join WealthTracker Pro in first 1000 users',
      icon: '🚀',
      color: '#ec4899',
      rarity: 'legendary',
      percentile: 5
    },
    {
      id: 'community_helper',
      name: 'Community Helper',
      description: 'Help 10 users with financial advice',
      icon: '🤝',
      color: '#06b6d4',
      rarity: 'rare',
      percentile: 15
    },
    {
      id: 'financial_guru',
      name: 'Financial Guru',
      description: 'Achieve all financial health targets',
      icon: '🧠',
      color: '#7c3aed',
      rarity: 'legendary',
      percentile: 2
    }
  ]

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#64748b'
      case 'uncommon': return '#22c55e'
      case 'rare': return '#3b82f6'
      case 'epic': return '#8b5cf6'
      case 'legendary': return '#ec4899'
      default: return '#64748b'
    }
  }

  const earnedBadges = badgeDefinitions.filter(badge => 
    badges.some(userBadge => userBadge.badge_id === badge.id)
  )

  const availableBadges = badgeDefinitions.filter(badge => 
    !badges.some(userBadge => userBadge.badge_id === badge.id)
  )

  if (loading) {
    return (
      <div style={{ padding: '16px', textAlign: 'center', color: '#94a3b8' }}>
        Loading badges...
      </div>
    )
  }

  return (
    <div style={{ padding: '24px' }}>
      {/* Progress Overview */}
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid #374151'
      }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '600', 
          color: 'white', 
          margin: '0 0 16px 0' 
        }}>
          Achievement Progress
        </h3>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '16px',
          marginBottom: '16px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px'
          }}>
            🏆
          </div>
          <div>
            <div style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              color: '#22c55e',
              lineHeight: '1'
            }}>
              {earnedBadges.length}/{badgeDefinitions.length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
              Badges Earned
            </div>
          </div>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#374151',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(earnedBadges.length / badgeDefinitions.length) * 100}%`,
            height: '100%',
            backgroundColor: '#22c55e',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Earned Badges */}
      {earnedBadges.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: 'white', 
            margin: '0 0 16px 0' 
          }}>
            Earned Badges ({earnedBadges.length})
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {earnedBadges.map(badge => (
              <div
                key={badge.id}
                style={{
                  backgroundColor: '#334155',
                  borderRadius: '12px',
                  padding: '16px',
                  border: `2px solid ${getRarityColor(badge.rarity)}`,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: getRarityColor(badge.rarity),
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {badge.rarity}
                </div>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '8px'
                }}>
                  {badge.icon}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  marginBottom: '4px'
                }}>
                  {badge.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#94a3b8',
                  marginBottom: '6px'
                }}>
                  {badge.description}
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: getRarityColor(badge.rarity),
                  fontWeight: '600',
                  textAlign: 'center'
                }}>
                  Better than {badge.percentile}% of users
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Badges */}
      {availableBadges.length > 0 && (
        <div>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '600', 
            color: 'white', 
            margin: '0 0 16px 0' 
          }}>
            Available Badges ({availableBadges.length})
          </h4>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '16px' 
          }}>
            {availableBadges.map(badge => (
              <div
                key={badge.id}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid #374151',
                  opacity: 0.7,
                  position: 'relative'
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#374151',
                  color: '#94a3b8',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {badge.rarity}
                </div>
                <div style={{
                  fontSize: '2rem',
                  marginBottom: '8px',
                  filter: 'grayscale(100%)'
                }}>
                  {badge.icon}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: '#94a3b8',
                  marginBottom: '4px'
                }}>
                  {badge.name}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BadgeSystem