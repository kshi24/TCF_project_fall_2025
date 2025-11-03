import React from 'react';

export default function AnalysisPopulated({ summary = null }) {
  return (
    <div>
      <h3 style={{ color: 'var(--text)' }}>Analysis (Populated)</h3>
      {summary ? (
        <pre style={{ color: 'var(--muted)' }}>{JSON.stringify(summary, null, 2)}</pre>
      ) : (
        <p style={{ color: 'var(--muted)' }}>No analysis data available yet.</p>
      )}
    </div>
  );
}
