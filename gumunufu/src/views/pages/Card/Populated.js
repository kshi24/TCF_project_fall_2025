import React from 'react';

export default function CardPopulated({ cards = [] }) {
  return (
    <div>
      <h3 style={{ color: 'var(--text)' }}>Cards (Populated)</h3>
      {cards.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No cards available.</p>
      ) : (
        <ul>
          {cards.map((c, i) => (
            <li key={i} style={{ color: 'var(--muted)' }}>{c.name} — {c.annualFee ? `$${c.annualFee}` : 'No fee'}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
