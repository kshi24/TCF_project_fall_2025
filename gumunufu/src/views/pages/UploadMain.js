import React from 'react';

export default function UploadMain() {
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

      <div className="quick-start-card" style={{marginTop: 24}}>
        <h3 className="quick-start-title">Quick Start</h3>
        <p className="quick-start-description">
          Try the app with sample data to see how it works
        </p>
        <button className="sample-button">Load Sample Data</button>
      </div>
    </div>
  );
}
