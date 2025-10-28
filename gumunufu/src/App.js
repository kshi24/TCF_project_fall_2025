import React, { useState } from 'react';

export default function AffordApp() {
  const [activeTab, setActiveTab] = useState('upload');

  function getTabStyle(tabName) {
    if (activeTab === tabName) {
      return {
        padding: '10px 20px',
        background: '#3b82f6',
        border: '1px solid #3b82f6',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s',
      };
    } else {
      return {
        padding: '10px 20px',
        background: '#1a2332',
        border: '1px solid #2d3748',
        borderRadius: '20px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        color: '#9ca3af',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'all 0.2s',
      };
    }
  }

  const blueUploadBoxStyle = {
    border: '2px dashed #1e40af',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#1e3a5f',
  };

  // Style for the purple upload box
  const purpleUploadBoxStyle = {
    border: '2px dashed #6b21a8',
    borderRadius: '12px',
    padding: '48px 24px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    background: '#3b1f5c',
  };

  const blueIconStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: 'white',
    background: '#2563eb',
  };

  const purpleIconStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '16px',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '32px',
    color: 'white',
    background: '#7c3aed',
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Get Ur Money Up Not Ur Funny Up</h1>
        <p style={styles.subtitle}>
          Analyze your spending habits and make informed purchase decisions based on your financial goals
        </p>
      </div>

      <div style={styles.tabContainer}>
        <button 
          style={getTabStyle('upload')}
          onClick={() => setActiveTab('upload')}
        >
          Upload Data
        </button>
        <button 
          style={getTabStyle('analysis')}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </button>
        <button 
          style={getTabStyle('budget')}
          onClick={() => setActiveTab('budget')}
        >
          Budget Chat
        </button>
        <button 
          style={getTabStyle('card')}
          onClick={() => setActiveTab('card')}
        >
          Card Optimizer
        </button>
      </div>

      <div style={styles.contentGrid}>
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Upload Transaction Data</h2>
          </div>
          <p style={styles.cardDescription}>
            Upload a CSV file with columns: date, name, amount, (optional: category, description)
          </p>
          <div style={blueUploadBoxStyle}>
            <div style={blueIconStyle}>
              <span style={styles.uploadArrow}>↑</span>
            </div>
            <p style={styles.uploadText}>Click to upload or drag and drop</p>
            <p style={styles.uploadSubtext}>CSV files only</p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Upload Credit Card Data</h2>
          </div>
          <p style={styles.cardDescription}>
            Upload a CSV with: name, annualFee, categories (JSON), bonusValue
          </p>
          <div style={purpleUploadBoxStyle}>
            <div style={purpleIconStyle}>
              <span style={styles.uploadArrow}>↑</span>
            </div>
            <p style={styles.uploadText}>Click to upload or drag and drop</p>
            <p style={styles.uploadSubtext}>CSV files only</p>
          </div>
        </div>
      </div>

      <div style={styles.quickStartCard}>
        <h3 style={styles.quickStartTitle}>Quick Start</h3>
        <p style={styles.quickStartDescription}>
          Try the app with sample data to see how it works
        </p>
        <button style={styles.sampleButton}>Load Sample Data</button>
      </div>

      <button style={styles.helpButton}>?</button>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#0f1419',
    padding: '40px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  
  header: {
    textAlign: 'center',
    marginBottom: '40px',
    maxWidth: '800px',
    margin: '0 auto 40px',
  },
  
  title: {
    fontSize: '36px',
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: '12px',
  },
  
  subtitle: {
    fontSize: '16px',
    color: '#9ca3af',
    lineHeight: '1.5',
  },
  
  tabContainer: {
    display: 'flex',
    gap: '8px',
    justifyContent: 'center',
    marginBottom: '40px',
    flexWrap: 'wrap',
  },
  
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    maxWidth: '1400px',
    margin: '0 auto 24px',
    padding: '0 20px',
  },
  
  card: {
    background: '#1a2332',
    borderRadius: '16px',
    padding: '32px',
    border: '1px solid #2d3748',
  },
  
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
  },
  
  cardTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#e5e7eb',
    margin: 0,
  },
  
  cardDescription: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '24px',
    lineHeight: '1.5',
  },
  
  uploadArrow: {
    fontWeight: 'bold',
  },
  
  uploadText: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#e5e7eb',
    marginBottom: '4px',
  },
  
  uploadSubtext: {
    fontSize: '13px',
    color: '#6b7280',
  },
  
  quickStartCard: {
    background: '#1a2332',
    borderRadius: '16px',
    padding: '24px 32px',
    maxWidth: '1400px',
    margin: '0 auto',
    border: '1px solid #2d3748',
  },
  
  quickStartTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: '8px',
  },
  
  quickStartDescription: {
    fontSize: '14px',
    color: '#9ca3af',
    marginBottom: '20px',
  },
  
  sampleButton: {
    width: '100%',
    padding: '16px',
    background: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  
  helpButton: {
    position: 'fixed',
    bottom: '32px',
    right: '32px',
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: '#374151',
    color: 'white',
    border: '1px solid #4b5563',
    fontSize: '24px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};