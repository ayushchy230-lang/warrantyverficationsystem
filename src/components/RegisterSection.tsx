import React, { useState } from 'react';
import { ShieldCheck, Lock, Sparkles, CheckCircle, RefreshCw } from 'lucide-react';
import { midnightService } from '../services/midnightService';
import { generateRandomSecret } from '../utils/cryptoUtils';

export const RegisterSection: React.FC = () => {
  const [productId, setProductId] = useState('PROD-LAPTOP-X1');
  const [durationDays, setDurationDays] = useState('365');
  const [customerIdentity, setCustomerIdentity] = useState('john.doe@example.com');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-9042');
  const [serialNumber, setSerialNumber] = useState('SN-8829-1002');
  const [warrantySecret, setWarrantySecret] = useState(() => generateRandomSecret());

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; commitmentHash: string; message: string } | null>(null);

  const handleGenerateSecret = () => {
    setWarrantySecret(generateRandomSecret());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const witness = {
      productId,
      serialNumber,
      invoiceNumber,
      customerIdentity,
      warrantySecret,
      purchaseDate: Math.floor(Date.now() / 1000)
    };

    const res = await midnightService.registerWarranty(
      productId,
      parseInt(durationDays, 10) || 365,
      witness
    );

    setLoading(false);
    setResult(res);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '0.6rem', borderRadius: '12px' }}>
            <ShieldCheck size={26} color="#8b5cf6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Register Product Warranty</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Manufacturer tool: Issue a confidential warranty. Public state updates, sensitive details remain local.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Public Inputs */}
            <div className="form-group">
              <label className="form-label">
                <span>Product ID</span>
                <span className="label-badge-public">Public Ledger</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
                placeholder="e.g. PROD-LAPTOP-X1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Warranty Duration (Days)</span>
                <span className="label-badge-public">Public Ledger</span>
              </label>
              <input
                type="number"
                className="form-input"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                required
                placeholder="365"
              />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: 'var(--glass-border)', margin: '1.5rem 0' }} />

          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontWeight: 600, fontSize: '0.95rem' }}>
              <Lock size={16} /> Private Witness Data (Never Exposed On-Chain)
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Customer Identity / Email</span>
                <span className="label-badge-private">Private Witness</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={customerIdentity}
                onChange={(e) => setCustomerIdentity(e.target.value)}
                required
                placeholder="customer@example.com"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Invoice Number</span>
                <span className="label-badge-private">Private Witness</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                required
                placeholder="INV-2026-XXXX"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Product Serial Number</span>
                <span className="label-badge-private">Private Witness</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
                placeholder="SN-XXXX-XXXX"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Warranty Secret Code</span>
                <span className="label-badge-private">Private Secret</span>
              </label>
              <div className="input-with-button">
                <input
                  type="text"
                  className="form-input"
                  value={warrantySecret}
                  onChange={(e) => setWarrantySecret(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleGenerateSecret}
                  title="Generate Random Secret"
                  style={{ padding: '0.85rem 1rem' }}
                >
                  <RefreshCw size={16} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem' }}
          >
            {loading ? (
              <span>Registering on Midnight...</span>
            ) : (
              <>
                <Sparkles size={18} /> Register Warranty Commitment
              </>
            )}
          </button>
        </form>

        {result && (
          <div
            className={`result-banner ${result.success ? 'valid' : 'invalid'}`}
            style={{ marginTop: '2rem', padding: '1.5rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '1.2rem', fontWeight: 700 }}>
              <CheckCircle size={22} color="#10b981" />
              <span>{result.message}</span>
            </div>
            <div style={{ marginTop: '0.8rem', fontFamily: 'var(--font-mono)', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              On-Chain ZK Commitment Hash: <br />
              <span style={{ color: 'var(--accent-cyan)', wordBreak: 'break-all' }}>{result.commitmentHash}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
