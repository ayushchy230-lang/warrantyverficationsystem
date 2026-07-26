import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { HomeSection } from './components/HomeSection';
import { RegisterSection } from './components/RegisterSection';
import { VerifySection } from './components/VerifySection';
import { ClaimSection } from './components/ClaimSection';
import { DashboardSection } from './components/DashboardSection';
import { WalletModal } from './components/WalletModal';
import { midnightService, WalletState } from './services/midnightService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [wallet, setWallet] = useState<WalletState>(midnightService.getWalletState());
  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = midnightService.subscribe(() => {
      setWallet(midnightService.getWalletState());
    });
    return () => unsubscribe();
  }, []);

  const handleConnectWallet = (address: string) => {
    midnightService.connectWallet(address);
  };

  const handleDisconnectWallet = () => {
    midnightService.disconnectWallet();
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
      />

      <main className="main-content">
        {activeTab === 'home' && <HomeSection setActiveTab={setActiveTab} />}
        {activeTab === 'register' && <RegisterSection />}
        {activeTab === 'verify' && <VerifySection />}
        {activeTab === 'claim' && <ClaimSection />}
        {activeTab === 'dashboard' && <DashboardSection />}
      </main>

      <footer
        style={{
          borderTop: 'var(--glass-border)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.85rem',
          backdropFilter: 'blur(10px)'
        }}
      >
        <p>
          🔒 <strong>Confidential Product Warranty Verification</strong> • Powered by <strong>Midnight ZK Proofs</strong> & Compact Smart Contracts.
        </p>
      </footer>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        wallet={wallet}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />
    </div>
  );
};

export default App;
