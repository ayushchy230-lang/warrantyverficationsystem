import React, { useState } from 'react';
import { Lock, CheckCircle2, XCircle, Cpu } from 'lucide-react';
import { midnightService } from '../services/midnightService';

export const VerifySection: React.FC = () => {
  const [productId, setProductId] = useState('PROD-SMART-TV-4K');
  const [serialNumber, setSerialNumber] = useState('SN-99881122');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-8801');
  const [warrantySecret, setWarrantySecret] = useState('secret-key-alice-777');
  const [customerIdentity, setCustomerIdentity] = useState('alice@example.com');

  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    commitmentHash: string;
    message: string;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await midnightService.verifyWarranty(
      productId,
      serialNumber,
      invoiceNumber,
      warrantySecret,
      customerIdentity
    );

    setLoading(false);
    setVerificationResult({
      tested: true,
      isValid: res.isValid,
      commitmentHash: res.commitmentHash,
      message: res.message
    });
  };

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto' }}>
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.6rem', borderRadius: '12px' }}>
            <Lock size={26} color="#3b82f6" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Confidential Warranty Verification</h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Customer tool: Prove you own a valid warranty without revealing your receipt, identity, or serial number.
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify}>
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
                <span>Product Serial Number</span>
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
                <span>Warranty Secret / Code</span>
                <span className="label-badge-private">Private Secret</span>
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
                <span>Customer Email (Optional Salt)</span>
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
            {loading ? (
              <span>Generating Zero-Knowledge Proof...</span>
            ) : (
              <>
                <Cpu size={18} /> Generate ZK Proof & Verify Warranty
              </>
            )}
          </button>
        </form>

        {/* Result Banner */}
        {verificationResult && (
          <div className={`result-banner ${verificationResult.isValid ? 'valid' : 'invalid'}`}>
            <div className="result-icon">
              {verificationResult.isValid ? (
                <CheckCircle2 size={64} color="#10b981" />
              ) : (
                <XCircle size={64} color="#f43f5e" />
              )}
            </div>
            <h3 className="result-title">
              {verificationResult.isValid ? '✅ Warranty Valid' : '❌ Invalid Warranty'}
            </h3>
            <p className="result-desc">{verificationResult.message}</p>

            <div
              style={{
                background: 'rgba(0,0,0,0.3)',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'left',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <div style={{ color: '#94a3b8', marginBottom: '0.3rem' }}>Disclosed Midnight Public State:</div>
              <div style={{ color: verificationResult.isValid ? '#34d399' : '#f87171', fontWeight: 700 }}>
                Verification Disclosed Output = {verificationResult.isValid ? 'true' : 'false'}
              </div>
              <div style={{ color: '#64748b', marginTop: '0.3rem' }}>
                Commitment: {verificationResult.commitmentHash}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
