import React, { useState } from 'react';
import { X, LogIn } from 'lucide-react';
import { authService, DEMO_PERSONAS, UserProfile } from '../services/authService';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SignInModal: React.FC<SignInModalProps> = ({ isOpen, onClose }) => {
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [role, setRole] = useState<'CUSTOMER' | 'MANUFACTURER' | 'VERIFIER'>('CUSTOMER');
  const [tab, setTab] = useState<'personas' | 'custom'>('personas');

  if (!isOpen) return null;

  const handleSelectPersona = (persona: UserProfile) => {
    authService.signIn(persona);
    onClose();
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName || !customEmail) return;
    authService.signInCustom(customName, customEmail, role);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ background: '#f1f5f9', padding: '0.5rem', borderRadius: '10px', color: '#0f172a' }}>
              <LogIn size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Sign In to Portal</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Midnight Warranty Credential Engine</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{ display: 'flex', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: '10px', marginBottom: '1.25rem' }}>
          <button
            onClick={() => setTab('personas')}
            className="nav-btn"
            style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', background: tab === 'personas' ? '#ffffff' : 'transparent', color: tab === 'personas' ? '#0f172a' : '#64748b' }}
          >
            Quick Demo Personas
          </button>
          <button
            onClick={() => setTab('custom')}
            className="nav-btn"
            style={{ flex: 1, textAlign: 'center', fontSize: '0.85rem', background: tab === 'custom' ? '#ffffff' : 'transparent', color: tab === 'custom' ? '#0f172a' : '#64748b' }}
          >
            Custom Sign In
          </button>
        </div>

        {tab === 'personas' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {DEMO_PERSONAS.map((p) => (
              <div key={p.id} className="persona-chip" onClick={() => handleSelectPersona(p)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: p.role === 'MANUFACTURER' ? '#eff6ff' : p.role === 'CUSTOMER' ? '#f0fdf4' : '#fff7ed',
                      color: p.role === 'MANUFACTURER' ? '#2563eb' : p.role === 'CUSTOMER' ? '#059669' : '#d97706',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0f172a' }}>{p.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.email}</div>
                  </div>
                </div>

                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.5rem',
                    borderRadius: '12px',
                    background: p.role === 'MANUFACTURER' ? '#dbeafe' : p.role === 'CUSTOMER' ? '#dcfce7' : '#fef3c7',
                    color: p.role === 'MANUFACTURER' ? '#1e40af' : p.role === 'CUSTOMER' ? '#166534' : '#92400e'
                  }}
                >
                  {p.role}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <form onSubmit={handleCustomSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                placeholder="alex@example.com"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
              >
                <option value="CUSTOMER">Customer (Verify & Claim)</option>
                <option value="MANUFACTURER">Manufacturer (Register Warranties)</option>
                <option value="VERIFIER">Authorized Verifier</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              Sign In to Session
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
