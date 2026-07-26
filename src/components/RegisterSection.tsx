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
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#f1f5f9', padding: '0.6rem', borderRadius: '12px', color: '#0f172a' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Register Product Warranty</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Manufacturer portal: Issue a confidential warranty. Public ledger updates while witness remains local.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Product Identifier</span>
                <span className="badge-public">Public State</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                required
                placeholder="PROD-LAPTOP-X1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Duration (Days)</span>
                <span className="badge-public">Public State</span>
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

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-light)', margin: '1.25rem 0' }} />

          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#dc2626', fontWeight: 600, fontSize: '0.88rem' }}>
            <Lock size={15} /> Private Witness Data (Remains Client-Side)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Customer Email</span>
                <span className="badge-private">Private Witness</span>
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
                <span className="badge-private">Private Witness</span>
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
                <span className="badge-private">Private Witness</span>
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
                <span className="badge-private">Private Secret</span>
              </label>
              <div className="input-row">
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
                  style={{ padding: '0.8rem' }}
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.85rem' }}
          >
            {loading ? (
              <span>Registering on Midnight Ledger...</span>
            ) : (
              <>
                <Sparkles size={16} /> Register Warranty Commitment
              </>
            )}
          </button>
        </form>

        {result && (
          <div className={`result-banner ${result.success ? 'valid' : 'invalid'}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
              <CheckCircle size={22} color="#059669" />
              <span>{result.message}</span>
            </div>
            <div style={{ marginTop: '0.6rem', fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              On-Chain ZK Commitment: <br />
              <span style={{ color: '#0f172a', fontWeight: 600, wordBreak: 'break-all' }}>{result.commitmentHash}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
