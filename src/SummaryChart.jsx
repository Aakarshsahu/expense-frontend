import React from 'react';
import {
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip as RPTooltip, Legend as RLegend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RBTooltip
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A78BFA', '#FB7185', '#60A5FA'];

export default function SummaryChart({ summary, loading }) {
  if (loading) return <div className="card"><p>Loading charts...</p></div>;

  // prepare data for pie and bar charts
  const pieData = (summary.byCategory || []).map(c => ({ name: c.category, value: c.total }));
  const barData = (summary.byCategory || []).map(c => ({ category: c.category, total: c.total }));

  return (
    <div className="card" style={{ paddingBottom: 12 }}>
      <h3>Summary</h3>

      <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', marginTop: 8, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', minWidth: 260, height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry) => entry.name}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RPTooltip formatter={(value) => `₹${value}`} />
              <RLegend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ flex: '1 1 320px', minWidth: 300, height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 8, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis />
              <RBTooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="total" fill="#0ea5a4" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <p><strong>Total:</strong> <span className="total-value">₹{summary.total ?? 0}</span> • <strong>Entries:</strong> {summary.count ?? 0}</p>
      </div>
    </div>
  );
}
