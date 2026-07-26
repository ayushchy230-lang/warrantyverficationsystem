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
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#f0fdf4', padding: '0.6rem', borderRadius: '12px', color: '#059669' }}>
            <Award size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Claim & Redeem Warranty</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Redeem service on the Midnight ledger. Updates redeemed count without broadcasting purchaser details.
            </p>
          </div>
        </div>

        <form onSubmit={handleClaim}>
          <div className="form-group">
            <label className="form-label">
              <span>Product Identifier</span>
              <span className="badge-public">Public Ledger</span>
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
                <span className="badge-private">Private Witness</span>
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
                <span className="badge-private">Private Witness</span>
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
                <span>Warranty Secret Key</span>
                <span className="badge-private">Private Witness</span>
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
                <span className="badge-private">Private Witness</span>
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
            className="btn-emerald"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.8rem', padding: '0.85rem' }}
          >
            {loading ? 'Executing Claim Circuit...' : 'Submit Claim Privately'}
          </button>
        </form>

        {result && (
          <div className={`result-banner ${result.success ? 'valid' : 'invalid'}`}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>
              {result.success ? <CheckCircle2 size={22} color="#059669" /> : <AlertCircle size={22} color="#dc2626" />}
              <span>{result.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
