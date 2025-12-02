import React, { useState, useEffect } from 'react';
import { getAnalysisData } from '../../services/analysisService';

const formatCurrency = (amount) => 
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);

const formatMonth = (monthKey) => {
  // monthKey is in format "YYYY-MM", parse directly to avoid timezone issues
  const [year, month] = monthKey.split('-');
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const monthIndex = parseInt(month, 10) - 1;
  return `${monthNames[monthIndex]} ${year}`;
};

const StatCard = ({ title, value }) => (
  <div className="card glass apple-shadow">
    <div className="card-header">
      <h3 className="card-title" style={{ fontSize: '0.875rem', color: '#64748b' }}>{title}</h3>
    </div>
    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>{value}</p>
  </div>
);

const ProgressBar = ({ percentage, color = 'linear-gradient(90deg, #3b82f6, #8b5cf6)' }) => (
  <div style={{ width: '100%', height: '8px', background: 'rgba(15,23,42,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
    <div style={{ width: `${percentage}%`, height: '100%', background: color, transition: 'width 0.3s ease' }} />
  </div>
);

export default function AnalysisMain() {
  const [analysis, setAnalysis] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await getAnalysisData();
      
      if (result.success && result.analysis && result.transactions) {
        setAnalysis(result.analysis);
        setTransactions(result.transactions);
      } else {
        setError(result.error || 'Failed to load analysis data');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    fontWeight: '500',
  };

  if (isLoading) {
    return (
      <div className="card">
        <div className="card-header"><h2 className="card-title">Analysis</h2></div>
        <div style={{ padding: '2rem', textAlign: 'center' }}><p>Loading analysis data...</p></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card">
        <div className="card-header"><h2 className="card-title">Analysis</h2></div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444' }}>Error: {error}</p>
          <button onClick={loadAnalysisData} style={{ ...buttonStyle, marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!analysis || transactions.length === 0) {
    return (
      <div className="card">
        <div className="card-header"><h2 className="card-title">Analysis</h2></div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>No transaction data available. Please upload a CSV file on the Upload Data tab.</p>
        </div>
      </div>
    );
  }

  const sortedCategories = Object.entries(analysis.categoryBreakdown)
    .map(([category, data]) => ({ category, ...data }))
    .sort((a, b) => b.total - a.total);

  const sortedMonths = Object.entries(analysis.monthlySpending)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <StatCard title="Total Spending" value={formatCurrency(analysis.totalSpending)} />
        <StatCard title="Total Transactions" value={analysis.totalTransactions} />
        <StatCard title="Average Transaction" value={formatCurrency(analysis.averageTransaction)} />
      </div>

      <div className="card glass apple-shadow">
        <div className="card-header"><h2 className="card-title">Spending by Category</h2></div>
        <div style={{ marginTop: '1rem' }}>
          {sortedCategories.map(({ category, total, count }) => {
            const percentage = (total / analysis.totalSpending) * 100;
            return (
              <div key={category} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>{category}</span>
                  <span style={{ fontWeight: '600' }}>{formatCurrency(total)} ({count} transactions)</span>
                </div>
                <ProgressBar percentage={percentage} />
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                  {percentage.toFixed(1)}% of total spending
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card glass apple-shadow">
        <div className="card-header"><h2 className="card-title">Monthly Spending Trend</h2></div>
        <div style={{ marginTop: '1rem' }}>
          {sortedMonths.map(({ month, total }) => {
            const maxMonth = Math.max(...sortedMonths.map(m => m.total));
            const percentage = (total / maxMonth) * 100;
            return (
              <div key={month} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: '500' }}>{formatMonth(month)}</span>
                  <span style={{ fontWeight: '600' }}>{formatCurrency(total)}</span>
                </div>
                <ProgressBar percentage={percentage} color="linear-gradient(90deg, #10b981, #3b82f6)" />
              </div>
            );
          })}
        </div>
      </div>

      <div className="card glass apple-shadow">
        <div className="card-header"><h2 className="card-title">Top Merchants</h2></div>
        <div style={{ marginTop: '1rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(15,23,42,0.1)' }}>
                <th style={{ textAlign: 'left', padding: '0.75rem', fontWeight: '600' }}>Merchant</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600' }}>Total</th>
                <th style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600' }}>Transactions</th>
              </tr>
            </thead>
            <tbody>
              {analysis.topMerchants.map((merchant, index) => (
                <tr key={merchant.name} style={{ borderBottom: '1px solid rgba(15,23,42,0.05)' }}>
                  <td style={{ padding: '0.75rem' }}><span style={{ fontWeight: '500' }}>#{index + 1}</span> {merchant.name}</td>
                  <td style={{ textAlign: 'right', padding: '0.75rem', fontWeight: '600' }}>{formatCurrency(merchant.total)}</td>
                  <td style={{ textAlign: 'right', padding: '0.75rem', color: '#64748b' }}>{merchant.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button onClick={loadAnalysisData} style={buttonStyle}>Refresh Data</button>
      </div>
    </div>
  );
}
