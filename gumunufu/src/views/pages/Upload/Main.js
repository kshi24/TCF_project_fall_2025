import React, { useCallback, useState } from 'react';

// UploadMain now stages two files (transactions + cards) and only "uploads" them
// when the Upload button is clicked. If you prefer this logic to live in a
// controller/model, we can move the submit handler there and pass a callback
// in via props. For now this keeps the staging in the view as requested.
export default function UploadMain({ onSubmitFiles } = {}) {
  const [txnFile, setTxnFile] = useState(null);
  const [cardFile, setCardFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const onDragOver = useCallback((e) => e.preventDefault(), []);

  const handleDropTxn = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) setTxnFile(f);
  }, []);

  const handleDropCard = useCallback((e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) setCardFile(f);
  }, []);

  function onFileInputTxn(e) {
    const f = e.target.files?.[0] ?? null;
    if (f) setTxnFile(f);
  }

  function onFileInputCard(e) {
    const f = e.target.files?.[0] ?? null;
    if (f) setCardFile(f);
  }

  function clearTxn() {
    setTxnFile(null);
  }

  function clearCard() {
    setCardFile(null);
  }

  function handleUploadClick() {
    if (!txnFile || !cardFile) return;
    const payload = { transactions: txnFile, cards: cardFile };
    // If a controller callback is provided, call it. Otherwise keep state-local
    if (typeof onSubmitFiles === 'function') onSubmitFiles(payload);
    setSubmitted(true);
  }

  return (
    <div>
      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upload Transaction Data</h2>
          </div>
          <p className="card-description">
            Upload a CSV file with columns: date, name, amount, (optional: category, description)
          </p>

          <div
            className="upload-box blue"
            onDrop={handleDropTxn}
            onDragOver={onDragOver}
            aria-label="Drop CSV files here"
          >
            <div className="icon blue">
              <span className="upload-arrow">↑</span>
            </div>
            <p className="upload-text">Click or drag a transaction CSV here</p>
            <p className="upload-subtext">CSV files only</p>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={onFileInputTxn}
              style={{ marginTop: 12 }}
            />
            {txnFile && (
              <div style={{ marginTop: 8 }}>
                <small style={{ color: 'var(--muted)' }}>{txnFile.name} — {Math.round(txnFile.size / 1024)} KB</small>
                <button className="small-link" onClick={clearTxn} style={{ marginLeft: 12 }}>Remove</button>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upload Credit Card Data</h2>
          </div>
          <p className="card-description">
            Upload a CSV with: name, annualFee, categories (JSON), bonusValue
          </p>
          <div
            className="upload-box purple"
            onDrop={handleDropCard}
            onDragOver={onDragOver}
            aria-label="Drop card CSV files here"
          >
            <div className="icon purple">
              <span className="upload-arrow">↑</span>
            </div>
            <p className="upload-text">Click or drag a card CSV here</p>
            <p className="upload-subtext">CSV files only</p>
            <input
              type="file"
              accept=".csv,text/csv"
              onChange={onFileInputCard}
              style={{ marginTop: 12 }}
            />
            {cardFile && (
              <div style={{ marginTop: 8 }}>
                <small style={{ color: 'var(--muted)' }}>{cardFile.name} — {Math.round(cardFile.size / 1024)} KB</small>
                <button className="small-link" onClick={clearCard} style={{ marginLeft: 12 }}>Remove</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <button
          className="primary"
          onClick={handleUploadClick}
          disabled={!txnFile || !cardFile}
        >
          Upload Files
        </button>
        {submitted && <span style={{ marginLeft: 12, color: 'var(--accent-blue)' }}>Files submitted.</span>}
      </div>
    </div>
  );
}
