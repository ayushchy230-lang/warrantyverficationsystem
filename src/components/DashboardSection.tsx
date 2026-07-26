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
          <div className="stat-icon-wrapper" style={{ background: '#eff6ff', color: '#2563eb' }}>
            <ShieldCheck size={26} />
          </div>
          <div>
            <div className="stat-label">Total Issued Warranties</div>
            <div className="stat-value">{stats.issuedCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#f0fdf4', color: '#059669' }}>
            <Award size={26} />
          </div>
          <div>
            <div className="stat-label">Total Redeemed</div>
            <div className="stat-value">{stats.redeemedCount}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper" style={{ background: '#fef3c7', color: '#d97706' }}>
            <Shield size={26} />
          </div>
          <div>
            <div className="stat-label">Active Warranties</div>
            <div className="stat-value">{stats.activeCount}</div>
          </div>
        </div>
      </div>

      {/* Verification Audit Log Table */}
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <List size={22} color="#0f172a" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Public Ledger Transaction Ticker</h3>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#059669', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.25rem 0.65rem', borderRadius: '12px', fontWeight: 600 }}>
            <EyeOff size={13} /> Zero Personal Data Displayed
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Product Identifier</th>
                <th>Action</th>
                <th>Commitment Hash</th>
                <th>Disclosed ZK Output</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No public transactions recorded on ledger yet.
                  </td>
                </tr>
              ) : (
                logs.map((item) => (
                  <tr key={item.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{formatTimestamp(item.timestamp)}</td>
                    <td style={{ fontWeight: 700, color: '#0f172a' }}>{item.productId}</td>
                    <td>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: '0.72rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '6px',
                          background:
                            item.action === 'REGISTER'
                              ? '#eff6ff'
                              : item.action === 'VERIFY'
                              ? '#f1f5f9'
                              : '#f0fdf4',
                          color:
                            item.action === 'REGISTER'
                              ? '#2563eb'
                              : item.action === 'VERIFY'
                              ? '#0f172a'
                              : '#059669'
                        }}
                      >
                        {item.action}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {item.commitmentHash}
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          color: item.status === 'SUCCESS' ? '#059669' : '#dc2626',
                          background: item.status === 'SUCCESS' ? '#f0fdf4' : '#fef2f2',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '10px'
                        }}
                      >
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
