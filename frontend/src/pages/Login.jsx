import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('demo@wealthtracker.com')
  const [password, setPassword] = useState('demo123')
  const [name, setName] = useState('')
  const [homeCurrency, setHomeCurrency] = useState('GBP')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const currencies = [
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (isLogin) {
        result = await login(email, password)
      } else {
        result = await register(email, password, name, homeCurrency)
      }

      if (result.success) {
        navigate('/')
      } else {
        setError(result.error)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{ backgroundColor: '#0f172a' }}>
      <div className="w-full max-w-md">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-center mb-2"
              style={{ 
                background: 'linear-gradient(to right, #ec4899, #db2777)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
            WealthTracker Pro
          </h1>
          <p className="text-center mb-8" style={{ color: '#94a3b8' }}>
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
          
          {isLogin && (
            <div className="mb-4 p-3 rounded-lg" 
                 style={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}>
              <p className="text-sm" style={{ color: '#94a3b8' }}>
                Demo credentials are pre-filled:
              </p>
              <p className="text-sm mt-1" style={{ color: '#22c55e' }}>
                Email: demo@wealthtracker.com<br/>
                Password: demo123
              </p>
              <p className="text-xs mt-2" style={{ color: '#64748b' }}>
                (Also accepts demo@example.com)
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-lg" 
                 style={{ backgroundColor: '#dc2626', color: 'white' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#f1f5f9' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field w-full"
                  placeholder="Enter your full name"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#f1f5f9' }}>
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#f1f5f9' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field w-full"
                placeholder="Enter your password"
                required
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#f1f5f9' }}>
                  Home Currency
                </label>
                <select
                  value={homeCurrency}
                  onChange={(e) => setHomeCurrency(e.target.value)}
                  className="input-field w-full"
                >
                  {currencies.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name} ({currency.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-lg font-medium"
            >
              {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm hover:underline"
              style={{ color: '#ec4899' }}
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}