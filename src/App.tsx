import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { RegisterSection } from './components/RegisterSection';
import { VerifySection } from './components/VerifySection';
import { ClaimSection } from './components/ClaimSection';
import { DashboardSection } from './components/DashboardSection';
import { WalletModal } from './components/WalletModal';
import { SignInModal } from './components/SignInModal';
import { midnightService, WalletState } from './services/midnightService';
import { authService, UserProfile } from './services/authService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [wallet, setWallet] = useState<WalletState>(midnightService.getWalletState());
  const [user, setUser] = useState<UserProfile | null>(authService.getUser());

  const [isWalletModalOpen, setIsWalletModalOpen] = useState<boolean>(false);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribeWallet = midnightService.subscribe(() => {
      setWallet(midnightService.getWalletState());
    });
    const unsubscribeAuth = authService.subscribe(() => {
      setUser(authService.getUser());
    });
    return () => {
      unsubscribeWallet();
      unsubscribeAuth();
    };
  }, []);

  const handleConnectWallet = (address: string) => {
    midnightService.connectWallet(address);
  };

  const handleDisconnectWallet = () => {
    midnightService.disconnectWallet();
  };

  const handleSignOut = () => {
    authService.signOut();
    setActiveTab('landing');
  };

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        wallet={wallet}
        onOpenWalletModal={() => setIsWalletModalOpen(true)}
        user={user}
        onOpenSignIn={() => setIsSignInModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main className="main-content">
        {activeTab === 'landing' && (
          <LandingPage
            onOpenSignIn={() => setIsSignInModalOpen(true)}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            isAuthenticated={!!user}
          />
        )}
        {activeTab === 'register' && <RegisterSection />}
        {activeTab === 'verify' && <VerifySection />}
        {activeTab === 'claim' && <ClaimSection />}
        {activeTab === 'dashboard' && <DashboardSection />}
      </main>

      <footer>
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

      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
      />
    </div>
  );
};

export default App;
