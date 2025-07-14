import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

const StreakWidget = () => {
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    lastLogin: null,
    streakActive: false
  })
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    fetchStreakData()
  }, [])

  const fetchStreakData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/streak', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setStreakData(response.data)
    } catch (err) {
      console.error('Failed to fetch streak data:', err)
      // Fallback to mock data for demo
      setStreakData({
        currentStreak: 7,
        longestStreak: 12,
        lastLogin: new Date().toISOString(),
        streakActive: true
      })
    } finally {
      setLoading(false)
    }
  }

  const getStreakIcon = (streak) => {
    if (streak >= 30) return '🔥'
    if (streak >= 14) return '⚡'
    if (streak >= 7) return '🎯'
    if (streak >= 3) return '✨'
    return '🌟'
  }

  const getStreakColor = (streak) => {
    if (streak >= 30) return '#ef4444'
    if (streak >= 14) return '#f59e0b'
    if (streak >= 7) return '#22c55e'
    if (streak >= 3) return '#3b82f6'
    return '#8b5cf6'
  }

  const getStreakTitle = (streak) => {
    if (streak >= 30) return 'Legendary Streak!'
    if (streak >= 14) return 'Epic Streak!'
    if (streak >= 7) return 'Great Streak!'
    if (streak >= 3) return 'Good Streak!'
    return 'Building Streak'
  }

  const getMotivationalMessage = (streak) => {
    if (streak >= 30) return "You're a wealth tracking legend! 🎉"
    if (streak >= 14) return "Incredible consistency! Keep it up! 💪"
    if (streak >= 7) return "One week strong! You're on fire! 🔥"
    if (streak >= 3) return "Great start! Building healthy habits! 📈"
    if (streak >= 1) return "Welcome back! Every day counts! 🌟"
    return "Start your streak today! 🚀"
  }

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '20px',
        border: '1px solid #374151',
        textAlign: 'center'
      }}>
        <div style={{ color: '#94a3b8' }}>Loading streak...</div>
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#1e293b',
      borderRadius: '16px',
      padding: '24px',
      border: '1px solid #374151',
      background: `linear-gradient(135deg, ${getStreakColor(streakData.currentStreak)}15, ${getStreakColor(streakData.currentStreak)}08)`
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: getStreakColor(streakData.currentStreak),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          {getStreakIcon(streakData.currentStreak)}
        </div>
        <div>
          <div style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            color: getStreakColor(streakData.currentStreak),
            lineHeight: '1'
          }}>
            {streakData.currentStreak} Day{streakData.currentStreak !== 1 ? 's' : ''}
          </div>
          <div style={{ color: 'white', fontSize: '0.875rem', fontWeight: '500' }}>
            {getStreakTitle(streakData.currentStreak)}
          </div>
        </div>
      </div>

      <div style={{
        fontSize: '0.875rem',
        color: '#94a3b8',
        marginBottom: '16px'
      }}>
        {getMotivationalMessage(streakData.currentStreak)}
      </div>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
        <div style={{
          backgroundColor: '#334155',
          borderRadius: '8px',
          padding: '12px',
          flex: 1,
          textAlign: 'center'
        }}>
          <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
            {streakData.longestStreak}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
            Longest Streak
          </div>
        </div>
        <div style={{
          backgroundColor: '#334155',
          borderRadius: '8px',
          padding: '12px',
          flex: 1,
          textAlign: 'center'
        }}>
          <div style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
            {streakData.streakActive ? 'Active' : 'Broken'}
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
            Status
          </div>
        </div>
      </div>

      {/* Streak Calendar */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ 
          fontSize: '0.875rem', 
          fontWeight: '500', 
          color: 'white', 
          marginBottom: '8px' 
        }}>
          Last 7 Days
        </div>
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
          {[...Array(7)].map((_, index) => {
            const dayActive = index < streakData.currentStreak
            return (
              <div
                key={index}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '4px',
                  backgroundColor: dayActive ? getStreakColor(streakData.currentStreak) : '#374151',
                  opacity: dayActive ? 1 : 0.3,
                  transition: 'all 0.2s ease'
                }}
              />
            )
          })}
        </div>
      </div>

      {/* Next Milestone */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <div style={{
          fontSize: '0.75rem',
          color: '#94a3b8',
          marginBottom: '4px'
        }}>
          Next Milestone
        </div>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: getStreakColor(streakData.currentStreak + 1)
        }}>
          {streakData.currentStreak < 3 ? '3 days' :
           streakData.currentStreak < 7 ? '7 days' :
           streakData.currentStreak < 14 ? '14 days' :
           streakData.currentStreak < 30 ? '30 days' : '365 days'}
        </div>
      </div>
    </div>
  )
}

export default StreakWidget