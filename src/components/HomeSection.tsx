import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Cpu, ArrowRight } from 'lucide-react';

interface HomeSectionProps {
  setActiveTab: (tab: string) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({ setActiveTab }) => {
  return (
    <div>
      <section className="hero-banner">
        <h1 className="hero-title">
          Confidential Product <br />
          <span className="gradient-text">Warranty Verification</span>
        </h1>
        <p className="hero-sub">
          A privacy-preserving warranty verification system built on <strong>Midnight</strong>. Customers can prove ownership of valid product warranties without revealing sensitive purchase receipts, invoice numbers, or personal identity.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => setActiveTab('verify')} style={{ padding: '0.85rem 1.8rem' }}>
            Verify Warranty Privately <ArrowRight size={18} />
          </button>
          <button className="btn-secondary" onClick={() => setActiveTab('register')} style={{ padding: '0.85rem 1.8rem' }}>
            Register Warranty (Manufacturer)
          </button>
        </div>
      </section>

      {/* Problem & Solution Comparison */}
      <div className="privacy-grid">
        <div className="model-box public">
          <div className="model-header" style={{ color: '#60a5fa' }}>
            <XCircle size={24} />
            <span>Today's Traditional Problem</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            Traditional warranty portals require customers to expose sensitive personal data to third parties, store databases vulnerable to leaks, and link purchasing history with identity.
          </p>
          <ul className="model-list">
            <li><XCircle size={16} color="#f43f5e" /> Customer Full Name & Contact Info exposed</li>
            <li><XCircle size={16} color="#f43f5e" /> Phone Number & Physical Address stored</li>
            <li><XCircle size={16} color="#f43f5e" /> Purchase Invoice & Serial Numbers tied to Identity</li>
            <li><XCircle size={16} color="#f43f5e" /> Purchase Date & Store Locations made public</li>
          </ul>
        </div>

        <div className="model-box private">
          <div className="model-header" style={{ color: '#c084fc' }}>
            <ShieldCheck size={24} />
            <span>Midnight ZK Solution</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.95rem' }}>
            Midnight's zero-knowledge smart contract enables customers to generate private zero-knowledge witnesses client-side, disclosing only the final verification decision.
          </p>
          <ul className="model-list">
            <li><CheckCircle2 size={16} color="#10b981" /> Private Witness: Name, Email, Phone remain hidden</li>
            <li><CheckCircle2 size={16} color="#10b981" /> Zero Exposure: Serial & Invoice numbers never on-chain</li>
            <li><CheckCircle2 size={16} color="#10b981" /> Disclose Only: Returns strictly ✅ Valid or ❌ Invalid</li>
            <li><CheckCircle2 size={16} color="#10b981" /> Public Ledger: Tracks aggregate statistics securely</li>
          </ul>
        </div>
      </div>

      {/* How Midnight Architecture Works */}
      <div className="glass-card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <Cpu size={24} color="#8b5cf6" />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Midnight Architecture & Privacy Model</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '14px', border: 'var(--glass-border)' }}>
            <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Public Ledger State
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>• Product ID (e.g. PROD-SMART-TV-4K)</li>
              <li>• Warranty Duration & Expiry Window</li>
              <li>• Total Issued Count</li>
              <li>• Total Redeemed Count</li>
              <li>• Contract Owner & Issuer Identity</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '14px', border: 'var(--glass-border)' }}>
            <div style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Private Witness (Client-Side)
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>• Customer Name / Email / Phone</li>
              <li>• Invoice Number & Retailer Receipt</li>
              <li>• Product Serial Number</li>
              <li>• Warranty Secret Key</li>
              <li>• Local Ownership Proof</li>
            </ul>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '14px', border: 'var(--glass-border)' }}>
            <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, marginBottom: '0.4rem', textTransform: 'uppercase' }}>
              Disclosed ZK Output
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <li>• Boolean: <strong>true</strong> (✅ Valid)</li>
              <li>• Boolean: <strong>false</strong> (❌ Invalid)</li>
              <li>• <strong>Zero</strong> purchase details revealed</li>
              <li>• Verified on-chain via ZK Proof</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
