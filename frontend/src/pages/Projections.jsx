import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Projections() {
  const { user } = useAuth()
  const [timeframe, setTimeframe] = useState('10')
  const [assumptions, setAssumptions] = useState({
    currentWealth: 250000,
    monthlyContributions: 2000,
    expectedReturn: 7,
    inflationRate: 3,
    retirementAge: 65,
    currentAge: 35
  })

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const calculateProjections = () => {
    const years = parseInt(timeframe)
    const monthlyRate = assumptions.expectedReturn / 100 / 12
    const months = years * 12
    
    // Future value calculation with compound interest
    const futureValue = assumptions.currentWealth * Math.pow(1 + assumptions.expectedReturn / 100, years) +
                       assumptions.monthlyContributions * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
    
    // Inflation-adjusted value
    const inflationAdjusted = futureValue / Math.pow(1 + assumptions.inflationRate / 100, years)
    
    return {
      futureValue,
      inflationAdjusted,
      totalContributions: assumptions.currentWealth + (assumptions.monthlyContributions * months),
      growth: futureValue - assumptions.currentWealth - (assumptions.monthlyContributions * months)
    }
  }

  const projections = calculateProjections()

  const scenarios = [
    {
      name: 'Conservative',
      return: 5,
      color: '#10b981',
      description: 'Lower risk, stable growth'
    },
    {
      name: 'Moderate',
      return: 7,
      color: '#3b82f6',
      description: 'Balanced risk and return'
    },
    {
      name: 'Aggressive',
      return: 9,
      color: '#f59e0b',
      description: 'Higher risk, potential for greater returns'
    }
  ]

  return (
    <div style={pageStyle}>
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
              Wealth Projections
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
              Forecast your financial future with different scenarios
            </p>
          </div>

          {/* Controls */}
          <div style={cardStyle}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
              Projection Settings
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Time Frame (Years)
                </label>
                <select
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="5">5 Years</option>
                  <option value="10">10 Years</option>
                  <option value="15">15 Years</option>
                  <option value="20">20 Years</option>
                  <option value="25">25 Years</option>
                  <option value="30">30 Years</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Current Wealth (£)
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
                    fontSize: '1rem'
                  }}
                  value={assumptions.currentWealth}
                  onChange={(e) => setAssumptions({...assumptions, currentWealth: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Monthly Contributions (£)
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
                    fontSize: '1rem'
                  }}
                  value={assumptions.monthlyContributions}
                  onChange={(e) => setAssumptions({...assumptions, monthlyContributions: parseInt(e.target.value)})}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Expected Return (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  value={assumptions.expectedReturn}
                  onChange={(e) => setAssumptions({...assumptions, expectedReturn: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Inflation Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    backgroundColor: '#334155', 
                    border: '1px solid #475569', 
                    borderRadius: '12px', 
                    color: 'white',
                    fontSize: '1rem'
                  }}
                  value={assumptions.inflationRate}
                  onChange={(e) => setAssumptions({...assumptions, inflationRate: parseFloat(e.target.value)})}
                />
              </div>
            </div>
          </div>

          {/* Main Projection */}
          <div style={{ ...cardStyle, marginTop: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
              Your Projection in {timeframe} Years
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                  {formatCurrency(projections.futureValue)}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Projected Value</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                  {formatCurrency(projections.inflationAdjusted)}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Inflation-Adjusted</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                  {formatCurrency(projections.totalContributions)}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Total Contributions</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ec4899', marginBottom: '4px' }}>
                  {formatCurrency(projections.growth)}
                </div>
                <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>Investment Growth</div>
              </div>
            </div>
          </div>

          {/* Scenario Analysis */}
          <div style={{ ...cardStyle, marginTop: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
              Scenario Analysis
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              {scenarios.map((scenario, index) => {
                const scenarioProjection = {
                  ...assumptions,
                  expectedReturn: scenario.return
                }
                const monthlyRate = scenarioProjection.expectedReturn / 100 / 12
                const months = parseInt(timeframe) * 12
                const futureValue = scenarioProjection.currentWealth * Math.pow(1 + scenarioProjection.expectedReturn / 100, parseInt(timeframe)) +
                                   scenarioProjection.monthlyContributions * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate)
                
                return (
                  <div key={index} style={{ 
                    padding: '24px', 
                    borderRadius: '12px', 
                    backgroundColor: '#334155',
                    border: `1px solid ${scenario.color}40`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ 
                        width: '12px', 
                        height: '12px', 
                        borderRadius: '50%', 
                        backgroundColor: scenario.color 
                      }}></div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0' }}>
                        {scenario.name}
                      </h4>
                    </div>
                    <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0 0 16px 0' }}>
                      {scenario.description}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Annual Return</span>
                        <span style={{ fontWeight: '600', color: scenario.color }}>{scenario.return}%</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Projected Value</span>
                        <span style={{ fontWeight: '600', color: 'white' }}>{formatCurrency(futureValue)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Retirement Planning */}
          <div style={{ ...cardStyle, marginTop: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
              Retirement Planning
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                  Current Status
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Current Age</span>
                    <span style={{ fontWeight: '500', color: '#e2e8f0' }}>{assumptions.currentAge}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Retirement Age</span>
                    <span style={{ fontWeight: '500', color: '#e2e8f0' }}>{assumptions.retirementAge}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Years to Retirement</span>
                    <span style={{ fontWeight: '500', color: '#ec4899' }}>{assumptions.retirementAge - assumptions.currentAge}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                  Retirement Projections
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Expected at Retirement</span>
                    <span style={{ fontWeight: '500', color: '#10b981' }}>
                      {formatCurrency(assumptions.currentWealth * Math.pow(1.07, assumptions.retirementAge - assumptions.currentAge))}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>4% Withdrawal Rule</span>
                    <span style={{ fontWeight: '500', color: '#3b82f6' }}>
                      {formatCurrency((assumptions.currentWealth * Math.pow(1.07, assumptions.retirementAge - assumptions.currentAge)) * 0.04)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#64748b', fontSize: '0.875rem' }}>Monthly Income</span>
                    <span style={{ fontWeight: '500', color: '#f59e0b' }}>
                      {formatCurrency(((assumptions.currentWealth * Math.pow(1.07, assumptions.retirementAge - assumptions.currentAge)) * 0.04) / 12)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Assumptions */}
          <div style={{ ...cardStyle, marginTop: '24px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
              Key Assumptions & Disclaimers
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ 
                padding: '16px', 
                borderRadius: '12px', 
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f59e0b', margin: '0 0 8px 0' }}>
                  Important Notice
                </h4>
                <p style={{ color: '#fbbf24', fontSize: '0.875rem', margin: '0', lineHeight: '1.5' }}>
                  These projections are estimates based on historical data and assumptions. Actual results may vary significantly due to market volatility, economic conditions, and other factors.
                </p>
              </div>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: '1.5' }}>
                <ul style={{ margin: '0', paddingLeft: '20px' }}>
                  <li>Returns are compounded annually</li>
                  <li>Contributions are made monthly</li>
                  <li>No account for taxes or fees</li>
                  <li>Inflation estimates based on historical averages</li>
                  <li>Past performance does not guarantee future results</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}