import React, { useState } from 'react';
import { Lock, CheckCircle2, XCircle, Cpu } from 'lucide-react';
import { midnightService } from '../services/midnightService';

export const VerifySection: React.FC = () => {
  const [productId, setProductId] = useState('PROD-SMART-TV-4K');
  const [serialNumber, setSerialNumber] = useState('SN-99881122');
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2026-8801');
  const [warrantySecret, setWarrantySecret] = useState('secret-key-alice-777');
  const [customerIdentity, setCustomerIdentity] = useState('alice@example.com');

  const [verifyingStep, setVerifyingStep] = useState<number>(0); // 0: Idle, 1: Construct Witness, 2: Execute Compact Circuit, 3: Completed
  const [verificationResult, setVerificationResult] = useState<{
    tested: boolean;
    isValid: boolean;
    commitmentHash: string;
    message: string;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerificationResult(null);

    setVerifyingStep(1);

    setTimeout(async () => {
      setVerifyingStep(2);

      setTimeout(async () => {
        const res = await midnightService.verifyWarranty(
          productId,
          serialNumber,
          invoiceNumber,
          warrantySecret,
          customerIdentity
        );

        setVerifyingStep(3);
        setVerificationResult({
          tested: true,
          isValid: res.isValid,
          commitmentHash: res.commitmentHash,
          message: res.message
        });
      }, 700);
    }, 600);
  };

  return (
    <div style={{ maxWidth: '760px', margin: '0 auto' }}>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ background: '#f1f5f9', padding: '0.6rem', borderRadius: '12px', color: '#0f172a' }}>
            <Lock size={24} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Confidential Warranty Verification</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Client-side ZK proof execution. Submit private witness credentials to generate proof off-chain.
            </p>
          </div>
        </div>

        {/* ZK Step Progress Bar */}
        <div className="zk-steps-bar">
          <div className={`zk-step-item ${verifyingStep >= 1 ? (verifyingStep > 1 ? 'completed' : 'active') : ''}`}>
            <div className="zk-step-icon">1</div>
            <div className="zk-step-label">Private Witness</div>
          </div>
          <div style={{ flex: 1, height: '2px', background: verifyingStep >= 2 ? 'var(--accent-emerald)' : '#e2e8f0', margin: '0 0.5rem' }} />
          <div className={`zk-step-item ${verifyingStep >= 2 ? (verifyingStep > 2 ? 'completed' : 'active') : ''}`}>
            <div className="zk-step-icon">2</div>
            <div className="zk-step-label">Compact Circuit</div>
          </div>
          <div style={{ flex: 1, height: '2px', background: verifyingStep >= 3 ? 'var(--accent-emerald)' : '#e2e8f0', margin: '0 0.5rem' }} />
          <div className={`zk-step-item ${verifyingStep === 3 ? 'completed' : ''}`}>
            <div className="zk-step-icon">3</div>
            <div className="zk-step-label">Disclosed Result</div>
          </div>
        </div>

        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label className="form-label">
              <span>Product Identifier</span>
              <span className="badge-public">Public Ledger Target</span>
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
                <span className="badge-private">Private Secret</span>
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
            className="btn-primary"
            disabled={verifyingStep === 1 || verifyingStep === 2}
            style={{ width: '100%', marginTop: '0.8rem', padding: '0.85rem' }}
          >
            {verifyingStep === 1 || verifyingStep === 2 ? (
              <span>Executing Compact ZK Circuit...</span>
            ) : (
              <>
                <Cpu size={18} /> Generate ZK Proof & Verify
              </>
            )}
          </button>
        </form>

        {/* Verification Result Card */}
        {verificationResult && (
          <div className={`result-banner ${verificationResult.isValid ? 'valid' : 'invalid'}`}>
            <div style={{ marginBottom: '0.75rem' }}>
              {verificationResult.isValid ? (
                <CheckCircle2 size={56} color="#059669" style={{ margin: '0 auto' }} />
              ) : (
                <XCircle size={56} color="#dc2626" style={{ margin: '0 auto' }} />
              )}
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              {verificationResult.isValid ? '✅ Warranty Valid' : '❌ Invalid Warranty'}
            </h3>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {verificationResult.message}
            </p>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid var(--border-light)',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'left',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-mono)'
              }}
            >
              <div style={{ color: 'var(--text-muted)', marginBottom: '0.2rem', fontWeight: 600 }}>
                Compact Circuit Output:
              </div>
              <div style={{ color: verificationResult.isValid ? '#059669' : '#dc2626', fontWeight: 700 }}>
                disclose(isValid) = {verificationResult.isValid ? 'true' : 'false'}
              </div>
              <div style={{ color: 'var(--text-muted)', marginTop: '0.3rem', wordBreak: 'break-all' }}>
                Commitment: {verificationResult.commitmentHash}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
