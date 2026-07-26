import React from 'react';
import { ShieldCheck, Wallet } from 'lucide-react';
import { WalletState } from '../services/midnightService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onOpenWalletModal
}) => {
  return (
    <header className="navbar">
      <div className="brand-container" onClick={() => setActiveTab('home')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <ShieldCheck size={26} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="brand-title">Midnight Warranty</span>
            <span className="brand-badge">ZK Privacy</span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
            Confidential Warranty Credentials
          </span>
        </div>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-btn ${activeTab === 'home' ? 'active' : ''}`}
          onClick={() => setActiveTab('home')}
        >
          Home
        </button>
        <button
          className={`nav-btn ${activeTab === 'register' ? 'active' : ''}`}
          onClick={() => setActiveTab('register')}
        >
          Register Warranty
        </button>
        <button
          className={`nav-btn ${activeTab === 'verify' ? 'active' : ''}`}
          onClick={() => setActiveTab('verify')}
        >
          Verify Warranty
        </button>
        <button
          className={`nav-btn ${activeTab === 'claim' ? 'active' : ''}`}
          onClick={() => setActiveTab('claim')}
        >
          Claim
        </button>
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
      </nav>

      <div className="header-actions">
        <div className="network-pill">
          <div className="network-dot" />
          <span>{wallet.network}</span>
        </div>

        <button className="btn-primary" onClick={onOpenWalletModal}>
          <Wallet size={18} />
          {wallet.isConnected ? (
            <span>
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </span>
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      </div>
    </header>
  );
};
