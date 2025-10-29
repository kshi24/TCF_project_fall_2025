import React, { useState, lazy, Suspense } from 'react';

const UploadMain = lazy(() => import('./pages/UploadMain'));
const AnalysisMain = lazy(() => import('./pages/AnalysisMain'));
const BudgetMain = lazy(() => import('./pages/BudgetMain'));
const CardMain = lazy(() => import('./pages/CardMain'));

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

      <div className="main-area">
        <Suspense fallback={<div className="card">Loading…</div>}>
          {activeTab === 'upload' && <UploadMain />}
          {activeTab === 'analysis' && <AnalysisMain />}
          {activeTab === 'budget' && <BudgetMain />}
          {activeTab === 'card' && <CardMain />}
        </Suspense>
      </div>

      <button className="help-button">?</button>
    </div>
  );
}
