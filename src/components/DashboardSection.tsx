import React, { useEffect, useState } from 'react';
import { ShieldCheck, Award, List, Shield, EyeOff } from 'lucide-react';
import { midnightService, VerificationLogItem } from '../services/midnightService';
import { formatTimestamp } from '../utils/cryptoUtils';

export const DashboardSection: React.FC = () => {
  const [stats, setStats] = useState(midnightService.getStatistics());
  const [logs, setLogs] = useState<VerificationLogItem[]>(midnightService.getLogs());

  useEffect(() => {
    const update = () => {
      setStats(midnightService.getStatistics());
      setLogs(midnightService.getLogs());
    };

    const unsubscribe = midnightService.subscribe(update);
    update();
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Stat Cards Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <div className="stat-lbl">Total Issued Warranties</div>
            <div className="stat-val" style={{ color: '#60a5fa' }}>
              {stats.issuedCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
            <Award size={28} />
          </div>
          <div>
            <div className="stat-lbl">Total Redeemed</div>
            <div className="stat-val" style={{ color: '#34d399' }}>
              {stats.redeemedCount}
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#c084fc' }}>
            <Shield size={28} />
          </div>
          <div>
            <div className="stat-lbl">Active Warranties</div>
            <div className="stat-val" style={{ color: '#c084fc' }}>
              {stats.activeCount}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Audit Log (Zero Personal Data Displayed) */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <List size={22} color="#8b5cf6" />
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Midnight Public Ledger Transaction Log</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: '#c084fc', background: 'rgba(139,92,246,0.1)', padding: '0.3rem 0.7rem', borderRadius: '14px' }}>
            <EyeOff size={14} /> Zero Personal Data Displayed
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="log-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Product ID</th>
                <th>Action</th>
                <th>Commitment Hash</th>
                <th>Disclosed ZK Output</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No public transactions recorded yet.
                  </td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={item.id}>
                    <td>{formatTimestamp(item.timestamp)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.productId}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '8px',
                          background:
                            item.action === 'REGISTER'
                              ? 'rgba(59, 130, 246, 0.15)'
                              : item.action === 'VERIFY'
                              ? 'rgba(139, 92, 246, 0.15)'
                              : 'rgba(16, 185, 129, 0.15)',
                          color:
                            item.action === 'REGISTER'
                              ? '#60a5fa'
                              : item.action === 'VERIFY'
                              ? '#c084fc'
                              : '#34d399'
                        }}
                      >
                        {item.action}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{item.commitmentHash}</td>
                    <td>
                      <span className={`status-tag ${item.status === 'SUCCESS' ? 'success' : 'failed'}`}>
                        {item.status === 'SUCCESS' ? '✅ SUCCESS' : '❌ REJECTED'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
