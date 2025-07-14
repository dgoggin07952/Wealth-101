import React from 'react'
import { useNavigate } from 'react-router-dom'
import BadgeSystem from '../components/BadgeSystem'
import StreakWidget from '../components/StreakWidget'
import WealthProgress from '../components/WealthProgress'
import DailyGoals from '../components/DailyGoals'

const Achievements = () => {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0f172a',
      color: 'white'
    }}>
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
              Achievements
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
              Track your progress and unlock badges for your financial journey
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <StreakWidget />
            <WealthProgress />
            <DailyGoals />
          </div>

          <BadgeSystem />
        </div>
      </div>
    </div>
  )
}

export default Achievements