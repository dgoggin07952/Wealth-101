import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const mockWealthData = {
  Monthly: [
    { period: 'Jan', wealth: 520000 },
    { period: 'Feb', wealth: 535000 },
    { period: 'Mar', wealth: 545000 },
    { period: 'Apr', wealth: 555000 },
    { period: 'May', wealth: 565000 },
    { period: 'Jun', wealth: 575000 },
  ],
  Quarterly: [
    { period: 'Q1 2023', wealth: 510000 },
    { period: 'Q2 2023', wealth: 535000 },
    { period: 'Q3 2023', wealth: 555000 },
    { period: 'Q4 2023', wealth: 575000 },
    { period: 'Q1 2024', wealth: 590000 },
    { period: 'Q2 2024', wealth: 610000 },
  ],
  Yearly: [
    { period: '2019', wealth: 420000 },
    { period: '2020', wealth: 450000 },
    { period: '2021', wealth: 485000 },
    { period: '2022', wealth: 520000 },
    { period: '2023', wealth: 575000 },
    { period: '2024', wealth: 610000 },
  ],
}

export default function WealthChart({ timeframe = 'Monthly' }) {
  const data = mockWealthData[timeframe] || mockWealthData.Monthly
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
        <XAxis 
          dataKey="period" 
          stroke="#94a3b8" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          stroke="#94a3b8" 
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '8px',
            color: '#f1f5f9'
          }}
          formatter={(value) => [`£${value.toLocaleString()}`, 'Wealth']}
          labelStyle={{ color: '#94a3b8' }}
        />
        <Line 
          type="monotone" 
          dataKey="wealth" 
          stroke="#ec4899" 
          strokeWidth={3}
          dot={{ fill: '#ec4899', strokeWidth: 2, r: 6 }}
          activeDot={{ r: 8, stroke: '#ec4899', strokeWidth: 2, fill: '#fff' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}