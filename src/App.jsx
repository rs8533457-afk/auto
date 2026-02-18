import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState('offline');

  useEffect(() => {
    fetch('http://localhost:5000/api/status')
      .then(res => res.json())
      .then(data => setBackendStatus(data.status))
      .catch(() => setBackendStatus('offline'));
  }, []);

  const connectChannel = () => {
    fetch('http://localhost:5000/api/auth/google')
      .then(res => res.json())
      .then(data => {
        if (data.url) {
          window.open(data.url, '_blank');
        }
      })
      .catch(err => console.error('Error connecting channel:', err));
  };

  return (
    <div className="layout">
      <aside className="sidebar glass-card">
        <div className="sidebar-header">
          <h2 className="glow-text">YT AUTO</h2>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className="icon">📊</span> Dashboard
          </button>
          <button
            className={`nav-item ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            <span className="icon">🚀</span> Automation Hub
          </button>
          <button
            className={`nav-item ${activeTab === 'queue' ? 'active' : ''}`}
            onClick={() => setActiveTab('queue')}
          >
            <span className="icon">⏳</span> Queue Manager
          </button>
          <button
            className={`nav-item ${activeTab === 'templates' ? 'active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            <span className="icon">📝</span> Templates
          </button>
          <button
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span className="icon">⚙️</span> Settings
          </button>
        </nav>
      </aside>

      <main className="content">
        <header className="header glass-card">
          <div className="header-left">
            <h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h3>
          </div>
          <div className="header-right">
            <div className={`backend-badge ${backendStatus}`}>
              Backend: {backendStatus.toUpperCase()}
            </div>
            <button className="btn-primary" onClick={connectChannel}>Connect Channel</button>
            <div className="user-profile">
              <div className="avatar">JD</div>
            </div>
          </div>
        </header>

        <section className="main-view">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'upload' && <AutomationHub />}
          {activeTab === 'queue' && <QueueManager />}
          {activeTab === 'templates' && <MetadataTemplates />}
          {/* Add more views as needed */}
        </section>
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="dashboard-grid">
      <div className="stats-card glass-card">
        <h4>Total Uploads</h4>
        <p className="large-txt">4.2k</p>
        <span className="trend positive">+12% this month</span>
      </div>
      <div className="stats-card glass-card">
        <h4>Success Rate</h4>
        <p className="large-txt">99.8%</p>
        <span className="trend positive">Relativity stable</span>
      </div>
      <div className="stats-card glass-card">
        <h4>Stored Templates</h4>
        <p className="large-txt">24</p>
        <span className="trend">Across 3 categories</span>
      </div>

      <div className="full-width-card glass-card">
        <h4>Recent Activity</h4>
        <ul className="activity-list">
          <li>
            <span className="status success">●</span>
            <span className="msg">Video "Daily Vlog #42" uploaded successfully</span>
            <span className="time">2 mins ago</span>
          </li>
          <li>
            <span className="status pending">○</span>
            <span className="msg">Video "Cooking Tutorial" scheduled for 6:00 PM</span>
            <span className="time">15 mins ago</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function AutomationHub() {
  return (
    <div className="upload-container">
      <div className="upload-zone glass-card">
        <div className="upload-icon">📁</div>
        <h3>Bulk Upload</h3>
        <p>Drag and drop videos here to start automation</p>
        <button className="btn-primary">Select Files</button>
      </div>

      <div className="automation-rules glass-card">
        <h4>Active Workflows</h4>
        <div className="rule-item">
          <span>Folder Watcher: <code>/videos/shorts</code></span>
          <span className="arrow">→</span>
          <span>Template: <code>Gaming Shorts</code></span>
          <button className="btn-small">Edit</button>
        </div>
      </div>
    </div>
  );
}

function QueueManager() {
  const queue = [
    { title: "React Tutorial Part 4", status: "Uploading", progress: 65, size: "1.2 GB" },
    { title: "Minecraft Secrets #12", status: "Processing", progress: 100, size: "850 MB" },
    { title: "Morning Routine", status: "Scheduled", progress: 0, size: "2.1 GB" },
  ];

  return (
    <div className="queue-manager glass-card">
      <div className="queue-header">
        <h4>Upload Queue</h4>
        <span className="count">{queue.length} Tasks Active</span>
      </div>
      <div className="queue-list">
        {queue.map((item, idx) => (
          <div key={idx} className="queue-item">
            <div className="item-info">
              <h5>{item.title}</h5>
              <span className="item-meta">{item.size} • {item.status}</span>
            </div>
            <div className="item-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
              </div>
              <span className="progress-txt">{item.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MetadataTemplates() {
  const templates = [
    { name: "Gaming Shorts", tags: ["gaming", "shorts", "viral"], desc: "Follow for more gaming content!" },
    { name: "Vlog Default", tags: ["vlog", "daily", "lifestyle"], desc: "Today was a crazy day..." },
  ];

  return (
    <div className="templates-view">
      <div className="templates-header">
        <h4>Metadata Templates</h4>
        <button className="btn-primary">+ New Template</button>
      </div>
      <div className="templates-grid">
        {templates.map((tpl, idx) => (
          <div key={idx} className="template-card glass-card">
            <h5>{tpl.name}</h5>
            <div className="tpl-tags">
              {tpl.tags.map(t => <span key={t} className="tag">#{t}</span>)}
            </div>
            <p className="tpl-desc">{tpl.desc}</p>
            <div className="tpl-actions">
              <button className="btn-small">Edit</button>
              <button className="btn-small btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
