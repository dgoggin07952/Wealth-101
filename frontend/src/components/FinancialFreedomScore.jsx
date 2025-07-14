import React, { useState, useEffect } from 'react'
import axios from 'axios'

const FinancialFreedomScore = () => {
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [improvements, setImprovements] = useState([])

  useEffect(() => {
    calculateFinancialFreedomScore()
  }, [])

  const calculateFinancialFreedomScore = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return

      const response = await axios.get('/api/analytics', {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const data = response.data
      const metrics = data.metrics

      // Calculate score components (out of 1000)
      let totalScore = 0
      const suggestions = []

      // Net Worth Component (300 points max)
      const netWorthScore = Math.min(300, Math.max(0, (metrics.current_wealth / 500000) * 300))
      totalScore += netWorthScore
      if (netWorthScore < 200) {
        suggestions.push('Increase your net worth by investing more regularly')
      }

      // Emergency Fund Component (200 points max) 
      const emergencyScore = Math.min(200, metrics.emergency_fund_months * 33.33)
      totalScore += emergencyScore
      if (emergencyScore < 100) {
        suggestions.push('Build emergency fund to 6 months of expenses')
      }

      // Savings Rate Component (200 points max)
      const savingsRate = metrics.net_savings_3m / Math.max(metrics.total_income_3m, 1)
      const savingsScore = Math.min(200, Math.max(0, savingsRate * 1000))
      totalScore += savingsScore
      if (savingsScore < 100) {
        suggestions.push('Increase your monthly savings rate')
      }

      // Debt Management Component (150 points max)
      const debtRatio = Math.abs(metrics.current_wealth - Math.max(metrics.current_wealth, 0)) / Math.max(metrics.current_wealth, 1)
      const debtScore = Math.min(150, Math.max(0, 150 - (debtRatio * 150)))
      totalScore += debtScore
      if (debtScore < 100) {
        suggestions.push('Reduce high-interest debt to improve your score')
      }

      // Investment Diversification Component (150 points max)
      const investmentScore = data.top_asset_categories.stocks_securities ? 
        Math.min(150, (data.top_asset_categories.stocks_securities / metrics.current_wealth) * 300) : 0
      totalScore += investmentScore
      if (investmentScore < 75) {
        suggestions.push('Diversify investments across different asset classes')
      }

      // Add general improvements if score is low
      if (totalScore < 400) {
        suggestions.push('Set up automatic transfers to savings accounts')
        suggestions.push('Review and optimize your monthly expenses')
      }

      setScore(Math.round(totalScore))
      setImprovements(suggestions.slice(0, 4)) // Show top 4 suggestions
      setLoading(false)
    } catch (error) {
      console.error('Error calculating financial freedom score:', error)
      setScore(0)
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 750) return '#10b981' // Green
    if (score >= 500) return '#f59e0b' // Yellow
    if (score >= 250) return '#f97316' // Orange
    return '#ef4444' // Red
  }

  const getScoreLabel = (score) => {
    if (score >= 750) return 'Excellent'
    if (score >= 500) return 'Good'
    if (score >= 250) return 'Fair'
    return 'Needs Work'
  }

  if (loading) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: '24px',
        padding: '32px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        marginBottom: '32px'
      }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          Calculating your financial freedom score...
        </div>
      </div>
    )
  }

  const circumference = 2 * Math.PI * 120
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 1000) * circumference

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
      borderRadius: '24px',
      padding: '32px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      marginBottom: '32px'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px'
      }}>
        {/* Circular Score Display */}
        <div style={{ position: 'relative', width: '280px', height: '280px' }}>
          <svg width="280" height="280" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <circle
              cx="140"
              cy="140"
              r="120"
              fill="none"
              stroke={getScoreColor(score)}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              style={{
                transition: 'stroke-dashoffset 1s ease-in-out'
              }}
            />
          </svg>
          
          {/* Score text in center */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: getScoreColor(score),
              lineHeight: '1'
            }}>
              {score}
            </div>
            <div style={{
              fontSize: '1rem',
              color: '#94a3b8',
              marginTop: '4px'
            }}>
              out of 1000
            </div>
            <div style={{
              fontSize: '1.125rem',
              color: getScoreColor(score),
              fontWeight: '600',
              marginTop: '8px'
            }}>
              {getScoreLabel(score)}
            </div>
          </div>
        </div>

        {/* Title */}
        <div style={{
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            margin: '0 0 8px 0'
          }}>
            Financial Freedom Score
          </h2>
          <p style={{
            fontSize: '1rem',
            color: '#94a3b8',
            margin: '0'
          }}>
            Your path to financial independence
          </p>
        </div>

        {/* Improvement Suggestions - Horizontal Scroller */}
        <div style={{
          width: '100%'
        }}>
          <h3 style={{
            fontSize: '1.125rem',
            fontWeight: '600',
            color: 'white',
            marginBottom: '16px',
            textAlign: 'center'
          }}>
            Ways to Improve Your Score
          </h3>
          <div style={{
            display: 'flex',
            gap: '16px',
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            paddingBottom: '8px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}>
            {/* Emergency Fund */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Emergency Fund
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Build 6 months of expenses
              </p>
            </div>

            {/* Disposable Income */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#10b981'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Disposable Income
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Achieve 25% disposable income
              </p>
            </div>

            {/* Buy a House */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#3b82f6'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Buy a House
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Build property ownership
              </p>
            </div>

            {/* Retirement Planning */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#8b5cf6'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Retirement Pot
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Set retirement milestone
              </p>
            </div>

            {/* Health Check Report */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#06b6d4'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Health Check Report
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Download financial health report
              </p>
            </div>

            {/* Estate Planning */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ec4899'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Estate Planning
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Download estate planning report
              </p>
            </div>

            {/* Income Protection */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#ef4444'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Income Protection
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Buy income protection insurance
              </p>
            </div>

            {/* Inheritance Tax Insurance */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f59e0b'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Inheritance Tax
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Buy inheritance tax insurance
              </p>
            </div>

            {/* Family Protection */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#22c55e'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Family Protection
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Buy family protection insurance
              </p>
            </div>

            {/* Write a Will */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#64748b'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Write a Will
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Create legal will document
              </p>
            </div>

            {/* Personal Details */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#a855f7'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Personal Details
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Complete your profile
              </p>
            </div>

            {/* Debt Consolidation */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#f97316'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Debt Consolidation
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Consolidate high-interest debt
              </p>
            </div>

            {/* Tax Planning */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#0ea5e9'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Tax Planning
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Optimize tax efficiency
              </p>
            </div>

            {/* Investment Diversification */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#84cc16'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Diversify Investments
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Spread across asset classes
              </p>
            </div>

            {/* Regular Financial Review */}
            <div style={{
              minWidth: '240px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              scrollSnapAlign: 'start',
              flexShrink: 0
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#e11d48'
                }}></div>
                <span style={{
                  color: '#e2e8f0',
                  fontSize: '0.875rem',
                  fontWeight: '500'
                }}>
                  Annual Review
                </span>
              </div>
              <p style={{
                color: '#94a3b8',
                fontSize: '0.8rem',
                margin: '0',
                lineHeight: '1.4'
              }}>
                Schedule financial review
              </p>
            </div>
          </div>
          
          {/* Scroll Dots */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '8px', 
            marginTop: '16px' 
          }}>
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? '#10b981' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialFreedomScore