import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function Profile() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('personal')
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    dateOfBirth: '',
    nationality: user?.home_country || 'United Kingdom',
    currency: user?.home_currency || 'GBP'
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

  const handleSave = () => {
    // TODO: Implement save functionality
    setEditing(false)
  }

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: '👤' },
    { id: 'contacts', name: 'Emergency Contacts', icon: '🚨' },
    { id: 'advisors', name: 'Financial Advisors', icon: '💼' },
    { id: 'documents', name: 'Documents', icon: '📄' },
    { id: 'preferences', name: 'Preferences', icon: '⚙️' }
  ]

  return (
    <div style={pageStyle}>
      <div style={{ padding: '32px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
                Profile & Settings
              </h1>
              <p style={{ color: '#94a3b8', fontSize: '1.1rem', margin: '0' }}>
                Manage your personal information and preferences
              </p>
            </div>
            <button
              onClick={() => setEditing(!editing)}
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
              {editing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {/* Profile Header Card */}
          <div style={{ ...cardStyle, marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, #ec4899, #be185d)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: '700',
                color: 'white'
              }}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white', margin: '0 0 8px 0' }}>
                  {user?.name || 'User Name'}
                </h2>
                <p style={{ color: '#94a3b8', margin: '0 0 4px 0' }}>{user?.email}</p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '0.75rem', 
                    padding: '4px 8px', 
                    borderRadius: '8px', 
                    backgroundColor: '#10b98120',
                    color: '#10b981'
                  }}>
                    {user?.user_type?.toUpperCase() || 'CLIENT'}
                  </span>
                  <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                    Member since {new Date().getFullYear()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px' }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 20px',
                  borderRadius: '12px',
                  border: activeTab === tab.id ? '2px solid #ec4899' : '1px solid #334155',
                  backgroundColor: activeTab === tab.id ? '#ec489920' : '#1e293b',
                  color: activeTab === tab.id ? '#ec4899' : '#94a3b8',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'personal' && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
                Personal Information
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    disabled={!editing}
                    style={{ 
                      width: '100%', 
                      padding: '16px', 
                      backgroundColor: editing ? '#334155' : '#1e293b', 
                      border: '1px solid #475569', 
                      borderRadius: '16px', 
                      color: 'white',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    disabled={!editing}
                    style={{ 
                      width: '100%', 
                      padding: '16px', 
                      backgroundColor: editing ? '#334155' : '#1e293b', 
                      border: '1px solid #475569', 
                      borderRadius: '16px', 
                      color: 'white',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    disabled={!editing}
                    style={{ 
                      width: '100%', 
                      padding: '16px', 
                      backgroundColor: editing ? '#334155' : '#1e293b', 
                      border: '1px solid #475569', 
                      borderRadius: '16px', 
                      color: 'white',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    disabled={!editing}
                    style={{ 
                      width: '100%', 
                      padding: '16px', 
                      backgroundColor: editing ? '#334155' : '#1e293b', 
                      border: '1px solid #475569', 
                      borderRadius: '16px', 
                      color: 'white',
                      fontSize: '1rem',
                      boxSizing: 'border-box'
                    }}
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                    Address
                  </label>
                  <textarea
                    disabled={!editing}
                    style={{ 
                      width: '100%', 
                      padding: '16px', 
                      backgroundColor: editing ? '#334155' : '#1e293b', 
                      border: '1px solid #475569', 
                      borderRadius: '16px', 
                      color: 'white',
                      fontSize: '1rem',
                      minHeight: '100px',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter your address"
                  />
                </div>
              </div>
              {editing && (
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button
                    onClick={handleSave}
                    style={buttonStyle}
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    style={{ 
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
                </div>
              )}
            </div>
          )}

          {activeTab === 'contacts' && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
                Emergency Contacts
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ 
                  padding: '24px', 
                  borderRadius: '12px', 
                  backgroundColor: '#334155',
                  border: '1px solid #475569'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                    Primary Emergency Contact
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Full Name
                      </label>
                      <input
                        type="text"
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569', 
                          borderRadius: '12px', 
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569', 
                          borderRadius: '12px', 
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Relationship
                      </label>
                      <select
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #475569', 
                          borderRadius: '12px', 
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                      >
                        <option value="">Select relationship</option>
                        <option value="spouse">Spouse</option>
                        <option value="parent">Parent</option>
                        <option value="sibling">Sibling</option>
                        <option value="child">Child</option>
                        <option value="friend">Friend</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button
                    style={{
                      ...buttonStyle,
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)'
                    }}
                  >
                    Add Another Contact
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'advisors' && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
                Financial Advisors & Professionals
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[
                  { title: 'Financial Advisor', icon: '💼', color: '#3b82f6' },
                  { title: 'Accountant', icon: '📊', color: '#10b981' },
                  { title: 'Solicitor', icon: '⚖️', color: '#f59e0b' },
                  { title: 'Insurance Broker', icon: '🛡️', color: '#ec4899' }
                ].map((advisor, index) => (
                  <div key={index} style={{ 
                    padding: '24px', 
                    borderRadius: '12px', 
                    backgroundColor: '#334155',
                    border: `1px solid ${advisor.color}40`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        borderRadius: '8px', 
                        background: `${advisor.color}20`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem'
                      }}>
                        {advisor.icon}
                      </div>
                      <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0' }}>
                        {advisor.title}
                      </h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                          Name
                        </label>
                        <input
                          type="text"
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569', 
                            borderRadius: '12px', 
                            color: 'white',
                            fontSize: '0.875rem'
                          }}
                          placeholder="Enter name"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                          Phone
                        </label>
                        <input
                          type="tel"
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569', 
                            borderRadius: '12px', 
                            color: 'white',
                            fontSize: '0.875rem'
                          }}
                          placeholder="Enter phone"
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                          Email
                        </label>
                        <input
                          type="email"
                          style={{ 
                            width: '100%', 
                            padding: '12px', 
                            backgroundColor: '#1e293b', 
                            border: '1px solid #475569', 
                            borderRadius: '12px', 
                            color: 'white',
                            fontSize: '0.875rem'
                          }}
                          placeholder="Enter email"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
                Important Documents
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                {[
                  { title: 'Will Location', icon: '📜', description: 'Location of your will and testament' },
                  { title: 'Power of Attorney', icon: '📋', description: 'Legal document locations' },
                  { title: 'Insurance Policies', icon: '🛡️', description: 'Policy documents and contacts' },
                  { title: 'Investment Accounts', icon: '📈', description: 'Account numbers and access details' }
                ].map((doc, index) => (
                  <div key={index} style={{ 
                    padding: '24px', 
                    borderRadius: '12px', 
                    backgroundColor: '#334155',
                    border: '1px solid #475569'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '1.5rem' }}>{doc.icon}</div>
                      <div>
                        <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0' }}>
                          {doc.title}
                        </h4>
                        <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                          {doc.description}
                        </p>
                      </div>
                    </div>
                    <textarea
                      style={{ 
                        width: '100%', 
                        padding: '12px', 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569', 
                        borderRadius: '12px', 
                        color: 'white',
                        fontSize: '0.875rem',
                        minHeight: '80px',
                        resize: 'vertical'
                      }}
                      placeholder="Enter details or location..."
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'white', margin: '0 0 24px 0' }}>
                Preferences & Settings
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                    Regional Settings
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Home Country
                      </label>
                      <select
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          backgroundColor: '#334155', 
                          border: '1px solid #475569', 
                          borderRadius: '12px', 
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                        value={formData.nationality}
                        onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                      >
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Australia">Australia</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#e2e8f0', marginBottom: '8px' }}>
                        Currency
                      </label>
                      <select
                        style={{ 
                          width: '100%', 
                          padding: '12px', 
                          backgroundColor: '#334155', 
                          border: '1px solid #475569', 
                          borderRadius: '12px', 
                          color: 'white',
                          fontSize: '0.875rem'
                        }}
                        value={formData.currency}
                        onChange={(e) => setFormData({...formData, currency: e.target.value})}
                      >
                        <option value="GBP">GBP (£)</option>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="CAD">CAD ($)</option>
                        <option value="AUD">AUD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: 'white', margin: '0 0 16px 0' }}>
                    Notifications
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {[
                      { title: 'Email Notifications', description: 'Receive updates about your account' },
                      { title: 'Monthly Reports', description: 'Get monthly financial summaries' },
                      { title: 'Goal Reminders', description: 'Reminders about financial milestones' },
                      { title: 'Security Alerts', description: 'Important security notifications' }
                    ].map((notification, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '16px',
                        borderRadius: '12px',
                        backgroundColor: '#334155'
                      }}>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'white' }}>
                            {notification.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                            {notification.description}
                          </div>
                        </div>
                        <div style={{ 
                          width: '44px', 
                          height: '24px', 
                          borderRadius: '12px', 
                          backgroundColor: '#ec4899',
                          position: 'relative',
                          cursor: 'pointer'
                        }}>
                          <div style={{ 
                            width: '18px', 
                            height: '18px', 
                            borderRadius: '50%', 
                            backgroundColor: 'white',
                            position: 'absolute',
                            top: '3px',
                            right: '3px',
                            transition: 'all 0.2s ease'
                          }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}