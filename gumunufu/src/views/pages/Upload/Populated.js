import React from 'react';

export default function UploadPopulated({ files = [] }) {
  return (
    <div>
      <h3 style={{ color: 'var(--text)' }}>Uploaded Data Preview</h3>
      {files.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>No files available yet.</p>
      ) : (
        <div>
          <p style={{ color: 'var(--muted)' }}>Files:</p>
          <ul>
            {files.map((f, i) => (
              <li key={i} style={{ color: 'var(--muted)' }}>{f.name} — {Math.round(f.size / 1024)} KB</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
