import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Reports() {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [reportType, setReportType] = useState('comprehensive')
  const [generatingPDF, setGeneratingPDF] = useState(false)
  const { user } = useAuth()

  const generateReport = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/reports/health-check', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setReportData(response.data)
    } catch (err) {
      console.error('Failed to generate report:', err)
      setError('Failed to generate report. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const downloadPDF = async (reportType) => {
    setGeneratingPDF(true)
    try {
      const token = localStorage.getItem('token')
      
      let endpoint = '/api/reports/financial-health'
      let filename = 'financial-health-report'
      
      if (reportType === 'wealth') {
        endpoint = '/api/reports/wealth'
        filename = 'wealth-report'
      } else if (reportType === 'estate') {
        endpoint = '/api/reports/estate-planning'
        filename = 'estate-planning-report'
      }
      
      const response = await axios.get(endpoint, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      })
      
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const finalFilename = `${filename}-${new Date().toISOString().split('T')[0]}.pdf`
      
      // Mobile-friendly download approach
      if (navigator.userAgent.match(/iPhone|iPad|iPod|Android/i)) {
        // For mobile devices, open in new window/tab
        const newWindow = window.open(url, '_blank')
        if (newWindow) {
          newWindow.document.title = finalFilename
          // Add a small delay to ensure the blob URL is ready
          setTimeout(() => {
            newWindow.document.body.innerHTML = `
              <div style="text-align: center; font-family: Arial, sans-serif; margin: 20px;">
                <h2>Download Your Report</h2>
                <p>Your PDF report is ready. Click the link below to download:</p>
                <a href="${url}" download="${finalFilename}" style="
                  display: inline-block;
                  background: #ec4899;
                  color: white;
                  padding: 15px 30px;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: bold;
                  margin: 20px 0;
                ">Download ${finalFilename}</a>
                <p style="font-size: 12px; color: #666;">
                  If the download doesn't start automatically, try tapping and holding the link above.
                </p>
              </div>
            `
          }, 100)
        } else {
          // Fallback: direct download
          const link = document.createElement('a')
          link.href = url
          link.download = finalFilename
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      } else {
        // Desktop: standard download
        const link = document.createElement('a')
        link.href = url
        link.download = finalFilename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
      
      // Clean up the blob URL after a delay
      setTimeout(() => {
        window.URL.revokeObjectURL(url)
      }, 10000)
      
    } catch (err) {
      console.error('Failed to download PDF:', err)
      setError('Failed to generate PDF. Please try again.')
    } finally {
      setGeneratingPDF(false)
    }
  }

  useEffect(() => {
    generateReport()
  }, [])

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

  const formatPercent = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getHealthColor = (score) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#22c55e'
    if (score >= 40) return '#f59e0b'
    if (score >= 20) return '#f97316'
    return '#ef4444'
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
                Financial Reports
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
                Comprehensive analysis of your financial position
              </p>
            </div>
            <button
              onClick={generateReport}
              disabled={loading}
              style={{
                ...buttonStyle,
                backgroundColor: loading ? '#475569' : undefined,
                background: loading ? '#475569' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Generating...' : 'Refresh Report'}
            </button>
          </div>

          {error && (
            <div style={{ 
              ...cardStyle, 
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.15))',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              marginBottom: '24px'
            }}>
              <div style={{ color: '#ef4444', fontWeight: '600' }}>Error</div>
              <div style={{ color: '#fecaca', marginTop: '4px' }}>{error}</div>
            </div>
          )}

          {/* Download Report Options */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            
            {/* Financial Health Report */}
            <div style={{ 
              padding: '32px', 
              borderRadius: '24px', 
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))',
              border: '1px solid rgba(16, 185, 129, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📊</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: '0 0 16px 0' }}>
                Financial Health Check
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 24px 0', lineHeight: '1.5' }}>
                Comprehensive analysis of your financial health, including scores, recommendations, cash flow analysis, and milestone tracking.
              </p>
              <button
                onClick={() => downloadPDF('health')}
                disabled={generatingPDF}
                style={{
                  ...buttonStyle,
                  width: '100%',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  backgroundColor: generatingPDF ? '#475569' : undefined,
                  cursor: generatingPDF ? 'not-allowed' : 'pointer',
                  fontSize: '1.125rem',
                  padding: '16px 24px'
                }}
              >
                {generatingPDF ? 'Creating PDF...' : 'Download Health Report'}
              </button>
            </div>

            {/* Wealth Report */}
            <div style={{ 
              padding: '32px', 
              borderRadius: '24px', 
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(29, 78, 216, 0.1))',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💰</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: '0 0 16px 0' }}>
                Wealth Report
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 24px 0', lineHeight: '1.5' }}>
                Detailed breakdown of your assets, liabilities, net worth trends over time, and wealth progression analysis.
              </p>
              <button
                onClick={() => downloadPDF('wealth')}
                disabled={generatingPDF}
                style={{
                  ...buttonStyle,
                  width: '100%',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  backgroundColor: generatingPDF ? '#475569' : undefined,
                  cursor: generatingPDF ? 'not-allowed' : 'pointer',
                  fontSize: '1.125rem',
                  padding: '16px 24px'
                }}
              >
                {generatingPDF ? 'Creating PDF...' : 'Download Wealth Report'}
              </button>
            </div>

            {/* Estate Planning Report */}
            <div style={{ 
              padding: '32px', 
              borderRadius: '24px', 
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(124, 58, 237, 0.1))',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🏛️</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: '0 0 16px 0' }}>
                Estate Planning
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '1rem', margin: '0 0 24px 0', lineHeight: '1.5' }}>
                Complete estate documentation for solicitors and family, including all assets, contacts, and legal information.
              </p>
              <button
                onClick={() => downloadPDF('estate')}
                disabled={generatingPDF}
                style={{
                  ...buttonStyle,
                  width: '100%',
                  background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                  backgroundColor: generatingPDF ? '#475569' : undefined,
                  cursor: generatingPDF ? 'not-allowed' : 'pointer',
                  fontSize: '1.125rem',
                  padding: '16px 24px'
                }}
              >
                {generatingPDF ? 'Creating PDF...' : 'Download Estate Report'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}