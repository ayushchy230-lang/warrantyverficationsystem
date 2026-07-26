import React from 'react';
import { ShieldCheck, LogIn, LogOut, User, Wallet } from 'lucide-react';
import { WalletState } from '../services/midnightService';
import { UserProfile } from '../services/authService';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  wallet: WalletState;
  onOpenWalletModal: () => void;
  user: UserProfile | null;
  onOpenSignIn: () => void;
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onOpenWalletModal,
  user,
  onOpenSignIn,
  onSignOut
}) => {
  return (
    <header className="navbar">
      <div className="brand-container" onClick={() => setActiveTab('landing')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon">
          <ShieldCheck size={24} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="brand-title">Midnight Warranty</span>
            <span className="brand-badge">Credential ZK</span>
          </div>
          <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', display: 'block' }}>
            Confidential Product Verification
          </span>
        </div>
      </div>

      <nav className="nav-links">
        <button
          className={`nav-btn ${activeTab === 'landing' ? 'active' : ''}`}
          onClick={() => setActiveTab('landing')}
        >
          Overview
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
          ZK Verify
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
          Ledger State
        </button>
      </nav>

      <div className="header-actions">
        <div className="network-pill">
          <div className="network-dot" />
          <span>{wallet.network}</span>
        </div>

        {/* User Auth Profile & Sign In / Sign Out */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f1f5f9',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 600
              }}
            >
              <User size={14} color="#0f172a" />
              <span>{user.name.split(' ')[0]}</span>
              <span
                style={{
                  fontSize: '0.65rem',
                  background: '#0f172a',
                  color: '#ffffff',
                  padding: '0.1rem 0.4rem',
                  borderRadius: '10px'
                }}
              >
                {user.role}
              </span>
            </div>

            <button
              className="btn-secondary"
              onClick={onSignOut}
              title="Sign Out"
              style={{ padding: '0.5rem 0.8rem', fontSize: '0.82rem' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button className="btn-secondary" onClick={onOpenSignIn} style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}>
            <LogIn size={16} /> Sign In
          </button>
        )}

        <button className="btn-primary" onClick={onOpenWalletModal} style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}>
          <Wallet size={16} />
          {wallet.isConnected ? (
            <span>
              {wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}
            </span>
          ) : (
            <span>Wallet</span>
          )}
        </button>
      </div>
    </header>
  );
};
