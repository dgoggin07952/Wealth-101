import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const DailyGoals = () => {
  const [goals, setGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [completedToday, setCompletedToday] = useState(0)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDailyGoals()
  }, [])

  const fetchDailyGoals = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/daily-goals', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setGoals(response.data.goals)
      setCompletedToday(response.data.completed_today)
    } catch (err) {
      console.error('Failed to fetch daily goals:', err)
      // Fallback to mock data
      const mockGoals = [
        {
          id: 'update_wealth',
          title: 'Update Your Wealth',
          description: 'Add or update an asset in your portfolio',
          icon: '💰',
          points: 50,
          completed: false,
          action: '/wealth'
        },
        {
          id: 'complete_task',
          title: 'Complete a Task',
          description: 'Finish an item from your Things To Do list',
          icon: '✅',
          points: 30,
          completed: false,
          action: '/'
        },
        {
          id: 'check_milestones',
          title: 'Review Milestones',
          description: 'Check progress on your financial goals',
          icon: '🎯',
          points: 25,
          completed: false,
          action: '/milestones'
        },
        {
          id: 'add_income',
          title: 'Log Income/Expense',
          description: 'Track your income or expenses',
          icon: '💸',
          points: 35,
          completed: false,
          action: '/income'
        },
        {
          id: 'generate_report',
          title: 'Generate Report',
          description: 'Create a financial health report',
          icon: '📊',
          points: 40,
          completed: false,
          action: '/reports'
        }
      ]
      setGoals(mockGoals)
      setCompletedToday(0)
    } finally {
      setLoading(false)
    }
  }

  const completeGoal = async (goalId) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(`/api/daily-goals/${goalId}/complete`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      // Update local state
      setGoals(goals.map(goal => 
        goal.id === goalId ? { ...goal, completed: true } : goal
      ))
      setCompletedToday(completedToday + 1)
      
      // Navigate to the goal's action page
      const goal = goals.find(g => g.id === goalId)
      if (goal && goal.action) {
        navigate(goal.action)
      }
    } catch (err) {
      console.error('Failed to complete goal:', err)
    }
  }

  const getCompletionMessage = () => {
    if (completedToday === 0) return "Start your day strong! 💪"
    if (completedToday === 1) return "Great start! Keep going! 🌟"
    if (completedToday === 2) return "You're on fire! 🔥"
    if (completedToday === 3) return "Amazing progress! 🚀"
    if (completedToday === 4) return "Almost there! One more! ⭐"
    if (completedToday === 5) return "Perfect day! All goals complete! 🎉"
    return "Overachiever! 🏆"
  }

  const getProgressPercentage = () => {
    return (completedToday / goals.length) * 100
  }

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#1e293b',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #374151',
        textAlign: 'center'
      }}>
        <div style={{ color: '#94a3b8' }}>Loading daily goals...</div>
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
          ✨
        </div>
        <div>
          <div style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: 'white',
            lineHeight: '1'
          }}>
            Daily Goals
          </div>
          <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
            {getCompletionMessage()}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: '500' }}>
            Progress
          </span>
          <span style={{ fontSize: '0.875rem', color: '#22c55e', fontWeight: '500' }}>
            {completedToday}/{goals.length}
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
            width: `${getProgressPercentage()}%`,
            height: '100%',
            backgroundColor: '#22c55e',
            transition: 'width 0.3s ease',
            borderRadius: '6px'
          }}></div>
        </div>
      </div>

      {/* Goals List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {goals.map(goal => (
          <div
            key={goal.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              backgroundColor: goal.completed ? '#065f46' : '#334155',
              borderRadius: '12px',
              border: `1px solid ${goal.completed ? '#10b981' : '#475569'}`,
              cursor: goal.completed ? 'default' : 'pointer',
              opacity: goal.completed ? 0.7 : 1,
              transition: 'all 0.3s ease'
            }}
            onClick={() => !goal.completed && completeGoal(goal.id)}
            onMouseEnter={(e) => {
              if (!goal.completed) {
                e.currentTarget.style.backgroundColor = '#475569'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (!goal.completed) {
                e.currentTarget.style.backgroundColor = '#334155'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: goal.completed ? '#22c55e' : '#374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              {goal.completed ? '✅' : goal.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '0.875rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '4px'
              }}>
                {goal.title}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                {goal.description}
              </div>
            </div>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: '600',
              color: '#22c55e',
              padding: '4px 8px',
              backgroundColor: 'rgba(34, 197, 94, 0.1)',
              borderRadius: '6px'
            }}>
              +{goal.points} XP
            </div>
          </div>
        ))}
      </div>

      {/* Completion Reward */}
      {completedToday === goals.length && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#22c55e',
          borderRadius: '12px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div style={{ fontSize: '1.25rem', marginBottom: '8px' }}>🎉</div>
          <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>
            All goals completed! +100 bonus XP
          </div>
        </div>
      )}
    </div>
  )
}

export default DailyGoals