import React from 'react';
import { Wallet, X, Server, ShieldCheck } from 'lucide-react';
import { WalletState } from '../services/midnightService';

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: WalletState;
  onConnect: (address: string) => void;
  onDisconnect: () => void;
}

export const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onConnect,
  onDisconnect
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Wallet size={24} color="#8b5cf6" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Midnight Wallet</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {wallet.isConnected ? (
          <div>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 700, marginBottom: '0.3rem' }}>CONNECTED WALLET ADDRESS</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', color: 'var(--text-primary)', wordBreak: 'break-all' }}>
                {wallet.address}
              </div>
            </div>

            <button
              className="btn-secondary"
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              style={{ width: '100%' }}
            >
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Select a Midnight network provider or wallet extension to interact with the ZK proof circuits:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <button
                className="btn-secondary"
                onClick={() => {
                  onConnect('0xMIDNIGHT_LACE_WALLET_8820');
                  onClose();
                }}
                style={{ justifyContent: 'space-between', padding: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <ShieldCheck size={20} color="#8b5cf6" />
                  <span>Midnight Lace Wallet</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#8b5cf6', background: 'rgba(139,92,246,0.15)', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>
                  Recommended
                </span>
              </button>

              <button
                className="btn-secondary"
                onClick={() => {
                  onConnect('0xMIDNIGHT_PROOF_SERVER_CLIENT_1092');
                  onClose();
                }}
                style={{ justifyContent: 'space-between', padding: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <Server size={20} color="#3b82f6" />
                  <span>Local Proof Server ({wallet.proofServerUrl})</span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#3b82f6', background: 'rgba(59,130,246,0.15)', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>
                  Active
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
