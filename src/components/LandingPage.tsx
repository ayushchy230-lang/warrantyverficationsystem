import React, { useState } from 'react';
import { Lock, CheckCircle2, ArrowRight, Sparkles, Cpu, EyeOff, Layers, FileCheck } from 'lucide-react';
import { midnightService } from '../services/midnightService';

interface LandingPageProps {
  onOpenSignIn: () => void;
  onNavigateToTab: (tab: string) => void;
  isAuthenticated: boolean;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenSignIn,
  onNavigateToTab,
  isAuthenticated
}) => {
  const [testProduct, setTestProduct] = useState('PROD-SMART-TV-4K');
  const [testSecret, setTestSecret] = useState('secret-key-alice-777');
  const [verifying, setVerifying] = useState(false);
  const [demoOutput, setDemoOutput] = useState<{ tested: boolean; isValid: boolean } | null>(null);

  const handleTestRun = async () => {
    setVerifying(true);
    setDemoOutput(null);

    setTimeout(async () => {
      const res = await midnightService.verifyWarranty(
        testProduct,
        'SN-99881122',
        'INV-2026-8801',
        testSecret,
        'alice@example.com'
      );
      setVerifying(false);
      setDemoOutput({ tested: true, isValid: res.isValid });
    }, 800);
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="hero-container">
        <div className="hero-tag">
          <Sparkles size={15} color="#059669" />
          <span>Zero-Knowledge Warranty Credentials</span>
        </div>

        <h1 className="hero-title">
          Verify Product Warranties <br />
          <span style={{ color: '#059669' }}>Without Exposing Receipts</span>
        </h1>

        <p className="hero-sub">
          Midnight's confidential smart contract architecture enables customers to prove ownership of valid product warranties without revealing invoice numbers, serials, purchase dates, or personal identity.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          {isAuthenticated ? (
            <button className="btn-primary" onClick={() => onNavigateToTab('verify')} style={{ padding: '0.85rem 1.8rem' }}>
              Launch Verification Engine <ArrowRight size={18} />
            </button>
          ) : (
            <button className="btn-primary" onClick={onOpenSignIn} style={{ padding: '0.85rem 1.8rem' }}>
              Sign In to Access Dashboard <ArrowRight size={18} />
            </button>
          )}

          <button className="btn-secondary" onClick={() => onNavigateToTab('dashboard')} style={{ padding: '0.85rem 1.8rem' }}>
            View Public State Ledger
          </button>
        </div>
      </section>

      {/* Live Interactive Proof Sandbox on Landing Page */}
      <div className="live-demo-card">
        <div className="live-badge">
          <div className="network-dot" /> LIVE ZK SANDBOX
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <Cpu size={22} color="#0f172a" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Interactive ZK Circuit Simulator</h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Try a real-time zero-knowledge verification right now. Modify the secret key below to test valid vs. invalid proof generation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Product Target (Public)
              </label>
              <input
                type="text"
                className="form-input"
                value={testProduct}
                onChange={(e) => setTestProduct(e.target.value)}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>
                Warranty Secret (Private Witness)
              </label>
              <input
                type="text"
                className="form-input"
                value={testSecret}
                onChange={(e) => setTestSecret(e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn-emerald"
            onClick={handleTestRun}
            disabled={verifying}
            style={{ width: '100%', padding: '0.8rem' }}
          >
            {verifying ? 'Executing ZK Circuit...' : 'Run ZK Proof Verification'}
          </button>

          {demoOutput && (
            <div
              className={`result-banner ${demoOutput.isValid ? 'valid' : 'invalid'}`}
              style={{ marginTop: '1.25rem', padding: '1.25rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
                {demoOutput.isValid ? (
                  <>
                    <CheckCircle2 size={22} color="#059669" />
                    <span>Disclosed Result: ✅ Warranty Valid (true)</span>
                  </>
                ) : (
                  <>
                    <span style={{ color: '#dc2626' }}>Disclosed Result: ❌ Invalid Warranty (false)</span>
                  </>
                )}
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.4rem', color: 'var(--text-muted)' }}>
                Zero customer names, invoice numbers, or serials were written to the public ledger.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enterprise Use Cases Grid */}
      <div style={{ margin: '3.5rem 0' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
            Built for Modern Confidential Credentials
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Eliminating privacy leaks across retail, medical devices, luxury goods, and consumer electronics.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div className="card">
            <div style={{ background: '#f1f5f9', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#0f172a' }}>
              <Lock size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Private Witness</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Purchase receipts, customer names, emails, and serial numbers are processed strictly on client devices.
            </p>
          </div>

          <div className="card">
            <div style={{ background: '#f0fdf4', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#059669' }}>
              <EyeOff size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Minimal Disclosure</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              The Compact smart contract circuit discloses strictly a boolean decision (`true` or `false`) to the verifier.
            </p>
          </div>

          <div className="card">
            <div style={{ background: '#eff6ff', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#2563eb' }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Public State Ledger</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Aggregate statistics (issued counts, active warranties, redeemed counts) remain transparent on Midnight.
            </p>
          </div>

          <div className="card">
            <div style={{ background: '#fef3c7', width: '44px', height: '44px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: '#d97706' }}>
              <FileCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.4rem' }}>Sybil-Resistant Claims</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Prevents double-redemption of warranties while ensuring zero-knowledge privacy for the claimant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
