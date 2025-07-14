import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const WealthProgress = () => {
  const [progressData, setProgressData] = useState({
    currentWealth: 0,
    yearStartWealth: 0,
    monthStartWealth: 0,
    yearGoal: 0,
    nextMilestone: 0
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchProgressData()
  }, [])

  const fetchProgressData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/wealth-progress', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setProgressData(response.data)
    } catch (err) {
      console.error('Failed to fetch progress data:', err)
      // Fallback to mock data for demo
      setProgressData({
        currentWealth: 145000,
        yearStartWealth: 120000,
        monthStartWealth: 142000,
        yearGoal: 200000,
        nextMilestone: 150000
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const getProgressPercentage = (current, start, goal) => {
    if (goal <= start) return 100
    return Math.min(((current - start) / (goal - start)) * 100, 100)
  }

  const yearProgress = getProgressPercentage(
    progressData.currentWealth,
    progressData.yearStartWealth,
    progressData.yearGoal
  )

  const milestoneProgress = getProgressPercentage(
    progressData.currentWealth,
    progressData.yearStartWealth,
    progressData.nextMilestone
  )

  const yearGrowth = progressData.currentWealth - progressData.yearStartWealth
  const monthGrowth = progressData.currentWealth - progressData.monthStartWealth

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #374151',
        textAlign: 'center'
      }}>
        <div style={{ color: '#94a3b8' }}>Loading progress...</div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#1e293b',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #374151',
      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(5, 150, 105, 0.05))'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: '#22c55e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          📈
        </div>
        <div>
          <div style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: 'white',
            lineHeight: '1'
          }}>
            Wealth Progress
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            Track your financial journey
          </div>
        </div>
      </div>

      {/* Current Wealth */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#22c55e',
          textAlign: 'center',
          marginBottom: '8px'
        }}>
          {formatCurrency(progressData.currentWealth)}
        </div>
        <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.875rem' }}>
          Current Net Worth
        </div>
      </div>

      {/* Growth Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div style={{
          backgroundColor: '#334155',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: yearGrowth >= 0 ? '#22c55e' : '#ef4444',
            marginBottom: '4px'
          }}>
            {yearGrowth >= 0 ? '+' : ''}{formatCurrency(yearGrowth)}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
            This Year
          </div>
        </div>
        <div style={{
          backgroundColor: '#334155',
          borderRadius: '8px',
          padding: '16px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: monthGrowth >= 0 ? '#22c55e' : '#ef4444',
            marginBottom: '4px'
          }}>
            {monthGrowth >= 0 ? '+' : ''}{formatCurrency(monthGrowth)}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
            This Month
          </div>
        </div>
      </div>

      {/* Year Goal Progress */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
            2025 Goal Progress
          </span>
          <span style={{ fontSize: '0.875rem', color: '#22c55e', fontWeight: '500' }}>
            {yearProgress.toFixed(1)}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '12px',
          backgroundColor: '#374151',
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${yearProgress}%`,
            height: '100%',
            backgroundColor: '#22c55e',
            transition: 'width 0.3s ease',
            borderRadius: '6px'
          }}></div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '4px'
        }}>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {formatCurrency(progressData.yearStartWealth)}
          </span>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
            {formatCurrency(progressData.yearGoal)}
          </span>
        </div>
      </div>

      {/* Next Milestone */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
            Next Milestone
          </span>
          <span style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: '500' }}>
            {milestoneProgress.toFixed(1)}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#374151',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${milestoneProgress}%`,
            height: '100%',
            backgroundColor: '#3b82f6',
            transition: 'width 0.3s ease',
            borderRadius: '4px'
          }}></div>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '8px'
        }}>
          <span style={{ fontSize: '0.875rem', color: '#3b82f6', fontWeight: '500' }}>
            {formatCurrency(progressData.nextMilestone - progressData.currentWealth)} to go
          </span>
        </div>
      </div>

      {/* Motivational Message */}
      <div style={{
        backgroundColor: '#22c55e',
        color: 'white',
        padding: '12px',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '0.875rem',
        fontWeight: '500'
      }}>
        {yearGrowth > 0 ? 
          `Great job! You're ${formatCurrency(yearGrowth)} richer this year! 🎉` :
          "Every journey starts with a single step. Keep going! 💪"
        }
      </div>
    </div>
  )
}

export default WealthProgress