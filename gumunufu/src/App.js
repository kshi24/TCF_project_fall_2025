import React, { useState } from 'react';

export default function AffordApp() {
  const [activeTab, setActiveTab] = useState('upload');

  function getTabClass(tabName) {
    return tabName === activeTab ? 'tab active' : 'tab';
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Get Ur Money Up Not Ur Funny Up</h1>
        <p className="subtitle">
          Analyze your spending habits and make informed purchase decisions based on your financial goals
        </p>
      </div>

      <div className="tab-container">
        <button
          className={getTabClass('upload')}
          onClick={() => setActiveTab('upload')}
        >
          Upload Data
        </button>
        <button
          className={getTabClass('analysis')}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </button>
        <button
          className={getTabClass('budget')}
          onClick={() => setActiveTab('budget')}
        >
          Budget Chat
        </button>
        <button
          className={getTabClass('card')}
          onClick={() => setActiveTab('card')}
        >
          Card Optimizer
        </button>
      </div>

      <div className="content-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upload Transaction Data</h2>
          </div>
          <p className="card-description">
            Upload a CSV file with columns: date, name, amount, (optional: category, description)
          </p>
          <div className="upload-box blue">
            <div className="icon blue">
              <span className="upload-arrow">↑</span>
            </div>
            <p className="upload-text">Click to upload or drag and drop</p>
            <p className="upload-subtext">CSV files only</p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Upload Credit Card Data</h2>
          </div>
          <p className="card-description">
            Upload a CSV with: name, annualFee, categories (JSON), bonusValue
          </p>
          <div className="upload-box purple">
            <div className="icon purple">
              <span className="upload-arrow">↑</span>
            </div>
            <p className="upload-text">Click to upload or drag and drop</p>
            <p className="upload-subtext">CSV files only</p>
          </div>
        </div>
      </div>

      <div className="quick-start-card">
        <h3 className="quick-start-title">Quick Start</h3>
        <p className="quick-start-description">
          Try the app with sample data to see how it works
        </p>
        <button className="sample-button">Load Sample Data</button>
      </div>

      <button className="help-button">?</button>
    </div>
  );
}