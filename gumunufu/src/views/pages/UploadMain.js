import React, { useCallback, useEffect, useRef, useState } from 'react';

import { sampleTransactions, sampleCards } from './sampleData';
import { parseTransactionCSV } from '../services/csvParser';
import { saveTransactionsToSupabase, fetchTransactionsFromSupabase, clearAllTransactions } from '../services/transactionService';

export default function UploadMain({
  transactions = [],
  creditCards = [],
  onLoadSampleData = () => {},
  onClearData = () => {},
}) {
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const statusTimeoutRef = useRef(null);

  const showStatus = useCallback(
    (message) => {
      setStatus(message);

      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }

      statusTimeoutRef.current = setTimeout(() => setStatus(''), 3500);
    },
    []
  );

  const handleTransactionUpload = useCallback(
    async (event) => {
      const file = event?.target?.files?.[0];
      if (!file) return;

      if (isLoading) return;
      setIsLoading(true);

      try {
        // Parse CSV file
        const transactions = await parseTransactionCSV(file);
        
        if (transactions.length === 0) {
          showStatus('No valid transactions found in CSV file.');
          setIsLoading(false);
          return;
        }

        // Save to Supabase
        const result = await saveTransactionsToSupabase(transactions);
        
        if (result.success) {
          // Fetch updated transactions from Supabase
          const fetchResult = await fetchTransactionsFromSupabase();
          if (fetchResult.success) {
            onLoadSampleData({ sampleTransactions: fetchResult.transactions, sampleCards });
          }
          showStatus(`Successfully uploaded ${transactions.length} transactions to Supabase.`);
        } else {
          showStatus(`Error uploading: ${result.error}`);
        }
      } catch (error) {
        console.error('Upload error:', error);
        showStatus(`Error processing file: ${error.message}`);
      } finally {
        setIsLoading(false);
        // Reset file input
        if (event?.target) {
          event.target.value = '';
        }
      }
    },
    [isLoading, onLoadSampleData, showStatus]
  );

  const handlePlaceholderUpload = useCallback(
    (event, label) => {
      if (event?.target) {
        event.target.value = '';
      }
      showStatus(`${label} upload coming soon. Use sample data to explore the optimizer.`);
    },
    [showStatus]
  );

  const handleLoadSampleData = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));
    onLoadSampleData({ sampleTransactions, sampleCards });
    showStatus(
      `Loaded ${sampleTransactions.length} sample transactions and ${sampleCards.length} credit cards.`
    );
    setIsLoading(false);
  }, [isLoading, onLoadSampleData, showStatus]);

  const handleClearData = useCallback(async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      // Clear from Supabase
      const result = await clearAllTransactions();
      
      if (result.success) {
        onClearData();
        showStatus('Cleared all data from Supabase.');
      } else {
        showStatus(`Error clearing data: ${result.error}`);
      }
    } catch (error) {
      console.error('Clear error:', error);
      showStatus(`Error clearing data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, onClearData, showStatus]);

  useEffect(() => {
    return () => {
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="content-grid">
      <div className="card glass apple-shadow hover-lift">
        <div className="card-header">
          <div>
            <h2 className="card-title">Upload Transaction Data</h2>
            <p className="card-description">
              Upload a CSV file with columns: date, name, amount, and optional category or description.
            </p>
          </div>
        </div>
        <label className="upload-control" style={{ cursor: isLoading ? 'wait' : 'pointer', opacity: isLoading ? 0.6 : 1 }}>
          <input
            type="file"
            accept=".csv"
            onChange={handleTransactionUpload}
            disabled={isLoading}
            style={{ display: 'none' }}
          />
          <div className="upload-icon">↑</div>
          <p className="upload-title">
            {isLoading ? 'Processing...' : 'Click to upload or drag and drop'}
          </p>
          <p className="upload-subtext">CSV files only</p>
        </label>

        {transactions.length > 0 && (
          <div className="status-toast" style={{ marginTop: 18 }}>
            ✓ {transactions.length} transactions ready
          </div>
        )}
      </div>

      <div className="card glass apple-shadow hover-lift">
        <div className="card-header">
          <div>
            <h2 className="card-title">Upload Credit Card Data</h2>
            <p className="card-description">
              Upload a CSV file with: name, annualFee, categories (JSON object), and bonusValue.
            </p>
          </div>
        </div>

        <label className="upload-control">
          <input
            type="file"
            accept=".csv"
            onChange={(event) => handlePlaceholderUpload(event, 'Credit card')}
            style={{ display: 'none' }}
          />
          <div className="upload-icon">↑</div>
          <p className="upload-title">Click to upload or drag and drop</p>
          <p className="upload-subtext">CSV files only</p>
        </label>

        {creditCards.length > 0 && (
          <div className="status-toast" style={{ marginTop: 18 }}>
            ✓ {creditCards.length} cards loaded
          </div>
        )}
      </div>

      <div className="quick-start-card">
        <div>
          <h3 className="card-title" style={{ marginBottom: 8 }}>
            Quick Start
          </h3>
          <p className="card-description" style={{ maxWidth: 560 }}>
            Load a realistic dataset to see the credit card optimizer react instantly. You can
            return to this tab later to clear the sample data or upload your own CSV files.
          </p>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          <button
            type="button"
            className="sample-button"
            onClick={handleLoadSampleData}
            disabled={isLoading}
            style={{ minWidth: 200 }}
          >
            {isLoading ? 'Loading sample data...' : 'Load Sample Data'}
          </button>
          <button
            type="button"
            className="sample-button"
            onClick={handleClearData}
            disabled={isLoading}
            style={{
              background: 'rgba(15,23,42,0.08)',
              color: '#0f172a',
              boxShadow: 'none',
            }}
          >
            {isLoading ? 'Clearing...' : 'Clear Data'}
          </button>
        </div>

        {status && <div className="status-toast">{status}</div>}
      </div>
    </div>
  );
}
