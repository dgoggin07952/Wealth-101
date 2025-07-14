import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const mockAssetData = [
  { name: 'Property', value: 350000, color: '#10b981' },
  { name: 'Investments', value: 125000, color: '#3b82f6' },
  { name: 'Cash & Savings', value: 75000, color: '#ec4899' },
  { name: 'Retirement', value: 25000, color: '#f59e0b' },
]

export default function AssetPieChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={mockAssetData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          stroke="none"
        >
          {mockAssetData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '8px',
            color: '#f1f5f9'
          }}
          formatter={(value) => [`£${value.toLocaleString()}`, 'Value']}
        />
        <Legend 
          wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }}
          formatter={(value) => <span style={{ color: '#94a3b8' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}