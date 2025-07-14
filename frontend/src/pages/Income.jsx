import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'

export default function Income() {
  const [incomeRecords, setIncomeRecords] = useState([])
  const [expenseRecords, setExpenseRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('income')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const { user } = useAuth()

  const [newRecord, setNewRecord] = useState({
    income_name: '',
    amount: '',
    category: '',
    frequency: 'Monthly',
    description: ''
  })

  const [newExpense, setNewExpense] = useState({
    expense_name: '',
    amount: '',
    category: '',
    frequency: 'Monthly',
    description: ''
  })
  
  const [dismissedExpenses, setDismissedExpenses] = useState(new Set())

  useEffect(() => {
    fetchIncomeRecords()
    fetchExpenseRecords()
  }, [])

  const fetchIncomeRecords = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/income', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setIncomeRecords(response.data)
    } catch (err) {
      console.error('Failed to fetch income:', err)
      setError('Failed to load income records')
    } finally {
      setLoading(false)
    }
  }

  const fetchExpenseRecords = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/expenses', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setExpenseRecords(response.data)
    } catch (err) {
      console.error('Failed to fetch expenses:', err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('token')
      const endpoint = activeTab === 'income' ? '/api/income' : '/api/expenses'
      const data = activeTab === 'income' ? newRecord : newExpense
      
      if (editingRecord) {
        await axios.put(`${endpoint}/${editingRecord.id}`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      } else {
        await axios.post(endpoint, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      }
      
      setShowAddForm(false)
      setEditingRecord(null)
      setNewRecord({
        income_name: '',
        amount: '',
        category: '',
        frequency: 'Monthly',
        description: ''
      })
      setNewExpense({
        expense_name: '',
        amount: '',
        category: '',
        frequency: 'Monthly',
        description: ''
      })
      
      if (activeTab === 'income') {
        fetchIncomeRecords()
      } else {
        fetchExpenseRecords()
      }
    } catch (err) {
      console.error('Failed to save record:', err)
      setError('Failed to save record')
    }
  }

  const handleEdit = (record) => {
    setEditingRecord(record)
    if (activeTab === 'income') {
      setNewRecord({
        income_name: record.income_name,
        amount: record.amount,
        category: record.category,
        frequency: record.frequency,
        description: record.description
      })
    } else {
      setNewExpense({
        expense_name: record.expense_name,
        amount: record.amount,
        category: record.category,
        frequency: record.frequency,
        description: record.description
      })
    }
    setShowAddForm(true)
  }

  const handleDelete = async (recordId) => {
    try {
      const token = localStorage.getItem('token')
      const endpoint = activeTab === 'income' ? '/api/income' : '/api/expenses'
      await axios.delete(`${endpoint}/${recordId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (activeTab === 'income') {
        fetchIncomeRecords()
      } else {
        fetchExpenseRecords()
      }
    } catch (err) {
      console.error('Failed to delete record:', err)
      setError('Failed to delete record')
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

  const incomeCategories = [
    'Salary', 'Business Income', 'Freelance', 'Investment Income', 'Rental Income', 'Other'
  ]

  const expenseCategories = [
    'Housing', 'Food & Dining', 'Transportation', 'Healthcare', 'Entertainment', 'Shopping', 'Utilities', 'Insurance', 'Other'
  ]

  const frequencies = ['One-time', 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually']

  const currentRecords = activeTab === 'income' ? incomeRecords : expenseRecords
  const currentCategories = activeTab === 'income' ? incomeCategories : expenseCategories

  // Common expenses that users might be missing
  const commonExpenses = [
    { name: 'Council Tax', category: 'Housing', icon: '🏠', description: 'Monthly local authority tax' },
    { name: 'Electricity', category: 'Utilities', icon: '⚡', description: 'Monthly electricity bill' },
    { name: 'Gas', category: 'Utilities', icon: '🔥', description: 'Monthly gas bill' },
    { name: 'Water', category: 'Utilities', icon: '💧', description: 'Monthly water bill' },
    { name: 'Internet', category: 'Utilities', icon: '📶', description: 'Monthly broadband/internet' },
    { name: 'Mobile Phone', category: 'Utilities', icon: '📱', description: 'Monthly mobile phone bill' },
    { name: 'Home Insurance', category: 'Insurance', icon: '🏠', description: 'Annual home insurance' },
    { name: 'Car Insurance', category: 'Insurance', icon: '🚗', description: 'Annual car insurance' },
    { name: 'TV License', category: 'Entertainment', icon: '📺', description: 'Annual TV license fee' },
    { name: 'Mortgage/Rent', category: 'Housing', icon: '🏠', description: 'Monthly housing payment' },
    { name: 'Groceries', category: 'Food & Dining', icon: '🛒', description: 'Weekly grocery shopping' },
    { name: 'Petrol', category: 'Transportation', icon: '⛽', description: 'Weekly fuel costs' }
  ]

  // Check which common expenses are missing and not dismissed
  const missingExpenses = commonExpenses.filter(commonExpense => {
    const isNotInRecords = !expenseRecords.some(record => 
      record.expense_name.toLowerCase().includes(commonExpense.name.toLowerCase()) ||
      (record.category === commonExpense.category && 
       commonExpense.name.toLowerCase().includes(record.expense_name.toLowerCase()))
    )
    const isNotDismissed = !dismissedExpenses.has(commonExpense.name)
    return isNotInRecords && isNotDismissed
  })
  
  const dismissExpense = (expenseName) => {
    setDismissedExpenses(prev => new Set([...prev, expenseName]))
  }

  const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0)
  const totalExpenses = expenseRecords.reduce((sum, record) => sum + record.amount, 0)
  const netIncome = totalIncome - totalExpenses

  if (loading) {
    return (
      <div style={pageStyle}>
        <div style={{ padding: '32px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <div style={{ fontSize: '1.125rem', color: '#94a3b8' }}>Loading financial data...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
              Income & Expenses
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
                Track your financial inflows and outflows
              </p>
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
                Add {activeTab === 'income' ? 'Income' : 'Expense'}
              </button>
            </div>
          </div>

          {/* Income & Expenses Overview */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              backgroundColor: '#1e293b',
              border: '1px solid #334155',
              borderRadius: '24px',
              padding: '32px',
              marginBottom: '24px',
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.05))'
            }}>
              {/* Scrollable Income & Expenses */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                overflowX: 'auto', 
                paddingBottom: '16px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#475569 #1e293b'
              }}
              id="income-scroller"
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft
                const scrollWidth = e.target.scrollWidth - e.target.clientWidth
                const scrollPercentage = scrollLeft / scrollWidth
                
                // Update dots based on scroll position
                const dots = document.querySelectorAll('.income-scroll-dot')
                dots.forEach((dot, index) => {
                  const dotPosition = index / (dots.length - 1)
                  const isActive = Math.abs(scrollPercentage - dotPosition) < 0.4
                  dot.style.backgroundColor = isActive ? '#22c55e' : 'rgba(255, 255, 255, 0.3)'
                  dot.style.transform = isActive ? 'scale(1.2)' : 'scale(1)'
                })
              }}>
                {/* Income Card */}
                <div style={{ 
                  minWidth: '180px',
                  padding: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('income')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#22c55e' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Total Income</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#22c55e', marginBottom: '12px' }}>
                    {formatCurrency(totalIncome)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Records</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {incomeRecords.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Avg Amount</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(incomeRecords.length > 0 ? totalIncome / incomeRecords.length : 0)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Status</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {activeTab === 'income' ? 'Active' : 'View'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expenses Card */}
                <div style={{ 
                  minWidth: '180px',
                  padding: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab('expenses')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#ef4444' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Total Expenses</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#ef4444', marginBottom: '12px' }}>
                    {formatCurrency(totalExpenses)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Records</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {expenseRecords.length}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Avg Amount</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {formatCurrency(expenseRecords.length > 0 ? totalExpenses / expenseRecords.length : 0)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Status</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {activeTab === 'expenses' ? 'Active' : 'View'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Net Income Card */}
                <div style={{ 
                  minWidth: '180px',
                  padding: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                    <div style={{ 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: netIncome >= 0 ? '#22c55e' : '#ef4444' 
                    }}></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '500', color: '#e2e8f0' }}>Net Income</span>
                  </div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '700', color: netIncome >= 0 ? '#22c55e' : '#ef4444', marginBottom: '12px' }}>
                    {formatCurrency(netIncome)}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Status</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {netIncome >= 0 ? 'Positive' : 'Negative'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Income vs Expenses</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {totalExpenses > 0 ? ((totalIncome / totalExpenses) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#94a3b8', fontSize: '0.6875rem' }}>Savings Rate</span>
                      <span style={{ color: '#e2e8f0', fontSize: '0.6875rem', fontWeight: '500' }}>
                        {totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(0) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scroll Indicator Dots */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '8px', 
                marginTop: '16px',
                marginBottom: '16px'
              }}>
                <div className="income-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: '#22c55e', 
                  transition: 'all 0.3s ease',
                  transform: 'scale(1.2)'
                }}></div>
                <div className="income-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
                <div className="income-scroll-dot" style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(255, 255, 255, 0.3)', 
                  transition: 'all 0.3s ease'
                }}></div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: '32px' }}>
            <button
              onClick={() => setActiveTab('income')}
              style={{
                padding: '12px 24px',
                borderRadius: '16px 0 0 16px',
                border: '1px solid #334155',
                backgroundColor: activeTab === 'income' ? '#22c55e' : '#1e293b',
                color: activeTab === 'income' ? 'white' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Income ({incomeRecords.length})
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              style={{
                padding: '12px 24px',
                borderRadius: '0 16px 16px 0',
                border: '1px solid #334155',
                backgroundColor: activeTab === 'expenses' ? '#ef4444' : '#1e293b',
                color: activeTab === 'expenses' ? 'white' : '#94a3b8',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Expenses ({expenseRecords.length})
            </button>
          </div>

          {/* Missing Expenses Alert - Only show for expenses tab */}
          {activeTab === 'expenses' && missingExpenses.length > 0 && (
            <div style={{ 
              ...cardStyle, 
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.05))',
              borderColor: 'rgba(245, 158, 11, 0.3)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '50%', 
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem'
                }}>
                  ⚠️
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#f59e0b', margin: '0 0 4px 0' }}>
                    Missing Common Expenses
                  </h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: '0' }}>
                    We noticed you might be missing some typical expenses. Click to add them:
                  </p>
                </div>
              </div>
              
              {/* Horizontal Scroller for Missing Expenses */}
              <div style={{ 
                display: 'flex', 
                gap: '16px', 
                overflowX: 'auto', 
                paddingBottom: '16px',
                scrollbarWidth: 'thin',
                scrollbarColor: '#475569 #1e293b',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
              id="missing-expenses-scroller"
              onScroll={(e) => {
                const scrollLeft = e.target.scrollLeft
                const scrollWidth = e.target.scrollWidth - e.target.clientWidth
                const scrollPercentage = scrollLeft / scrollWidth
                
                // Update dots based on scroll position
                const dots = document.querySelectorAll('.missing-expense-dot')
                if (dots.length > 0) {
                  dots.forEach((dot, index) => {
                    const dotPosition = index / (dots.length - 1)
                    const isActive = Math.abs(scrollPercentage - dotPosition) < 0.15
                    dot.style.backgroundColor = isActive ? '#f59e0b' : 'rgba(245, 158, 11, 0.3)'
                    dot.style.transform = isActive ? 'scale(1.2)' : 'scale(1)'
                  })
                }
              }}>
                {missingExpenses.map((expense, index) => (
                  <div
                    key={index}
                    style={{
                      minWidth: '200px',
                      width: '200px',
                      padding: '16px',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)',
                      borderRadius: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      scrollSnapAlign: 'start',
                      scrollSnapStop: 'always',
                      flexShrink: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      position: 'relative'
                    }}
                    onClick={() => {
                      setNewExpense({
                        expense_name: expense.name,
                        amount: '',
                        category: expense.category,
                        frequency: 'Monthly',
                        description: expense.description
                      })
                      setShowAddForm(true)
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.2)'
                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.4)'
                      e.currentTarget.style.transform = 'scale(1.02)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(245, 158, 11, 0.1)'
                      e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.2)'
                      e.currentTarget.style.transform = 'scale(1)'
                    }}
                  >
                    {/* Dismiss button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        dismissExpense(expense.name)
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(239, 68, 68, 0.8)',
                        border: 'none',
                        color: 'white',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s ease',
                        zIndex: 1
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 1)'
                        e.currentTarget.style.transform = 'scale(1.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.8)'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      ×
                    </button>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.25rem' }}>{expense.icon}</span>
                      <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#f59e0b' }}>
                        {expense.name}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: '1.4' }}>
                      {expense.description}
                    </div>
                    <div style={{ 
                      marginTop: 'auto',
                      padding: '4px 8px',
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      color: '#f59e0b',
                      fontWeight: '500',
                      textAlign: 'center'
                    }}>
                      {expense.category}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Scroll Indicator Dots */}
              {missingExpenses.length > 3 && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  marginTop: '16px'
                }}>
                  {Array.from({ length: Math.ceil(missingExpenses.length / 3) }).map((_, index) => (
                    <div 
                      key={index}
                      className="missing-expense-dot"
                      style={{ 
                        width: '6px', 
                        height: '6px', 
                        borderRadius: '50%', 
                        backgroundColor: index === 0 ? '#f59e0b' : 'rgba(245, 158, 11, 0.3)', 
                        transition: 'all 0.3s ease',
                        transform: index === 0 ? 'scale(1.2)' : 'scale(1)'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Records List */}
          {currentRecords.length === 0 ? (
            <div style={{ ...cardStyle, textAlign: 'center', padding: '48px 24px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                {activeTab === 'income' ? '💰' : '💳'}
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 8px 0' }}>
                No {activeTab === 'income' ? 'Income' : 'Expenses'} Found
              </h3>
              <p style={{ color: '#94a3b8', margin: '0 0 24px 0' }}>
                Start tracking your {activeTab === 'income' ? 'income sources' : 'expenses'} to get insights into your financial health.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                style={buttonStyle}
              >
                Add Your First {activeTab === 'income' ? 'Income' : 'Expense'}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentRecords.map((record) => (
                <div
                  key={record.id}
                  style={{
                    ...cardStyle,
                    cursor: 'pointer',
                    borderColor: activeTab === 'income' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '20px 24px'
                  }}
                  onClick={() => handleEdit(record)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.01)'
                    e.currentTarget.style.borderColor = activeTab === 'income' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                    e.currentTarget.style.borderColor = activeTab === 'income' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: activeTab === 'income' ? '#22c55e' : '#ef4444',
                      flexShrink: 0
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'white', margin: '0 0 4px 0' }}>
                        {activeTab === 'income' ? record.income_name : record.expense_name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                          {record.category}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>•</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                          {record.frequency}
                        </span>
                        <span style={{ color: '#64748b', fontSize: '0.75rem' }}>•</span>
                        <span style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
                          {new Date(activeTab === 'income' ? record.income_date : record.expense_date).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEdit(record)
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid #475569',
                          backgroundColor: '#334155',
                          color: '#e2e8f0',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(record.id)
                        }}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(239, 68, 68, 0.3)',
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          color: '#ef4444',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <div style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: '700', 
                      color: activeTab === 'income' ? '#22c55e' : '#ef4444', 
                      textAlign: 'right' 
                    }}>
                      {formatCurrency(record.amount)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Form Modal */}
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
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: '0' }}>
                {editingRecord ? 'Edit' : 'Add'} {activeTab === 'income' ? 'Income' : 'Expense'}
              </h2>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingRecord(null)
                }}
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
                  {activeTab === 'income' ? 'Income' : 'Expense'} Name
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
                  placeholder={activeTab === 'income' ? 'e.g., Monthly Salary' : 'e.g., Groceries'}
                  value={activeTab === 'income' ? newRecord.income_name : newExpense.expense_name}
                  onChange={(e) => {
                    if (activeTab === 'income') {
                      setNewRecord({...newRecord, income_name: e.target.value})
                    } else {
                      setNewExpense({...newExpense, expense_name: e.target.value})
                    }
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Amount (£)
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
                  placeholder="0.00"
                  value={activeTab === 'income' ? newRecord.amount : newExpense.amount}
                  onChange={(e) => {
                    if (activeTab === 'income') {
                      setNewRecord({...newRecord, amount: e.target.value})
                    } else {
                      setNewExpense({...newExpense, amount: e.target.value})
                    }
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Category
                </label>
                <select
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
                  value={activeTab === 'income' ? newRecord.category : newExpense.category}
                  onChange={(e) => {
                    if (activeTab === 'income') {
                      setNewRecord({...newRecord, category: e.target.value})
                    } else {
                      setNewExpense({...newExpense, category: e.target.value})
                    }
                  }}
                >
                  <option value="">Select category</option>
                  {currentCategories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Frequency
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
                  value={activeTab === 'income' ? newRecord.frequency : newExpense.frequency}
                  onChange={(e) => {
                    if (activeTab === 'income') {
                      setNewRecord({...newRecord, frequency: e.target.value})
                    } else {
                      setNewExpense({...newExpense, frequency: e.target.value})
                    }
                  }}
                >
                  {frequencies.map(freq => (
                    <option key={freq} value={freq}>{freq}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                  Description (Optional)
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
                  placeholder="Additional details..."
                  value={activeTab === 'income' ? newRecord.description : newExpense.description}
                  onChange={(e) => {
                    if (activeTab === 'income') {
                      setNewRecord({...newRecord, description: e.target.value})
                    } else {
                      setNewExpense({...newExpense, description: e.target.value})
                    }
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '16px', paddingTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingRecord(null)
                  }}
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
                  {editingRecord ? 'Update' : 'Add'} {activeTab === 'income' ? 'Income' : 'Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}