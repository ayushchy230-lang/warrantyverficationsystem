import React, { useState } from 'react';
import { Award, CheckCircle2, AlertCircle } from 'lucide-react';
import { midnightService } from '../services/midnightService';

export const ClaimSection: React.FC = () => {
  const [productId, setProductId] = useState('PROD-SMART-TV-4K');
  const [serialNumber, setSerialNumber] = useState('SN-99881122');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-8801');
  const [warrantySecret, setWarrantySecret] = useState('secret-key-alice-777');
  const [customerIdentity, setCustomerIdentity] = useState('alice@example.com');

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await midnightService.claimWarranty(
      productId,
      serialNumber,
      invoiceNumber,
      warrantySecret,
      customerIdentity
    );

    setLoading(false);
    setResult(res);
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '0.6rem', borderRadius: '12px' }}>
            <Award size={26} color="#10b981" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Claim & Redeem Warranty</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Executes claim circuit on Midnight ledger. Marks warranty as redeemed while keeping purchaser details private.
            </p>
          </div>
        </div>

        <form onSubmit={handleClaim}>
          <div className="form-group">
            <label className="form-label">
              <span>Product ID</span>
              <span className="label-badge-public">Public Ledger Target</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">
                <span>Serial Number</span>
                <span className="label-badge-private">Private Witness</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                required
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
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Warranty Secret</span>
                <span className="label-badge-private">Private Witness</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={warrantySecret}
                onChange={(e) => setWarrantySecret(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Customer Email</span>
                <span className="label-badge-private">Private Witness</span>
              </label>
              <input
                type="text"
                className="form-input"
                value={customerIdentity}
                onChange={(e) => setCustomerIdentity(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '1rem', padding: '0.9rem' }}
          >
            {loading ? 'Executing Claim Circuit...' : 'Submit Claim Privately'}
          </button>
        </form>

        {result && (
          <div className={`result-banner ${result.success ? 'valid' : 'invalid'}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '1.2rem', fontWeight: 700 }}>
              {result.success ? <CheckCircle2 size={24} color="#10b981" /> : <AlertCircle size={24} color="#f43f5e" />}
              <span>{result.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
