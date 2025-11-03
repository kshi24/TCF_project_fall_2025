import React from 'react';

export default function BudgetPopulated({ budget = null }) {
  return (
    <div>
      <h3 style={{ color: 'var(--text)' }}>Budget (Populated)</h3>
      {budget ? (
        <pre style={{ color: 'var(--muted)' }}>{JSON.stringify(budget, null, 2)}</pre>
      ) : (
        <p style={{ color: 'var(--muted)' }}>No budget data available yet.</p>
      )}
    </div>
  );
}
