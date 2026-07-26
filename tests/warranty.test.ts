import { describe, it, expect, beforeEach } from 'vitest';
import { MidnightWarrantyContractSimulator, PrivateWitnessData } from '../contract/warranty_simulator';
import { computeWarrantyCommitment } from '../src/utils/cryptoUtils';

describe('Midnight Compact Contract: Confidential Product Warranty Verification', () => {
  let simulator: MidnightWarrantyContractSimulator;

  beforeEach(() => {
    simulator = new MidnightWarrantyContractSimulator('PROD-MONITOR-4K', 365 * 24 * 3600);
  });

  it('1. Register warranty - registers commitment on public ledger and increments issued count', async () => {
    const witness: PrivateWitnessData = {
      customerIdentity: 'bob@example.com',
      invoiceNumber: 'INV-2026-9901',
      serialNumber: 'SN-MON-10029',
      purchaseDate: Math.floor(Date.now() / 1000),
      warrantySecret: 'secret-bob-8812'
    };

    const commitmentHash = await computeWarrantyCommitment({
      productId: 'PROD-MONITOR-4K',
      ...witness
    });

    const initialStats = simulator.getStatistics();
    expect(initialStats.issuedCount).toBe(0);

    const regResult = simulator.registerWarranty(
      'PROD-MONITOR-4K',
      365 * 24 * 3600,
      commitmentHash,
      witness
    );

    expect(regResult.success).toBe(true);
    expect(regResult.commitmentHash).toBe(commitmentHash);

    const updatedStats = simulator.getStatistics();
    expect(updatedStats.issuedCount).toBe(1);
    expect(updatedStats.activeCount).toBe(1);
    expect(updatedStats.redeemedCount).toBe(0);
  });

  it('2. Verify valid warranty - returns true for matching commitment & secret key', async () => {
    const now = Math.floor(Date.now() / 1000);
    const witness: PrivateWitnessData = {
      customerIdentity: 'alice@example.com',
      invoiceNumber: 'INV-2026-7711',
      serialNumber: 'SN-MON-77119',
      purchaseDate: now - 3600, // 1 hour ago
      warrantySecret: 'secret-alice-9921'
    };

    const commitmentHash = await computeWarrantyCommitment({
      productId: 'PROD-MONITOR-4K',
      ...witness
    });

    simulator.registerWarranty('PROD-MONITOR-4K', 365 * 24 * 3600, commitmentHash, witness);

    // Customer submits ZK proof
    const isValid = simulator.verifyWarranty(
      'PROD-MONITOR-4K',
      commitmentHash,
      'secret-alice-9921',
      now
    );

    expect(isValid).toBe(true);
  });

  it('3. Reject expired warranty - returns false when current timestamp > expiry timestamp', async () => {
    const purchaseDate = Math.floor(Date.now() / 1000) - (400 * 24 * 3600); // 400 days ago
    const durationSeconds = 365 * 24 * 3600; // 1 year validity

    const witness: PrivateWitnessData = {
      customerIdentity: 'charlie@example.com',
      invoiceNumber: 'INV-2024-0012',
      serialNumber: 'SN-MON-00129',
      purchaseDate,
      warrantySecret: 'secret-charlie-3311'
    };

    const commitmentHash = await computeWarrantyCommitment({
      productId: 'PROD-MONITOR-4K',
      ...witness
    });

    simulator.registerWarranty('PROD-MONITOR-4K', durationSeconds, commitmentHash, witness);

    // Verify today
    const now = Math.floor(Date.now() / 1000);
    const isValid = simulator.verifyWarranty(
      'PROD-MONITOR-4K',
      commitmentHash,
      'secret-charlie-3311',
      now
    );

    expect(isValid).toBe(false); // Expired
  });

  it('4. Reject invalid proof - returns false for incorrect secret key or un-registered commitment', async () => {
    const witness: PrivateWitnessData = {
      customerIdentity: 'dave@example.com',
      invoiceNumber: 'INV-2026-1144',
      serialNumber: 'SN-MON-11449',
      purchaseDate: Math.floor(Date.now() / 1000),
      warrantySecret: 'correct-secret-dave'
    };

    const commitmentHash = await computeWarrantyCommitment({
      productId: 'PROD-MONITOR-4K',
      ...witness
    });

    simulator.registerWarranty('PROD-MONITOR-4K', 365 * 24 * 3600, commitmentHash, witness);

    // Attempt with WRONG secret
    const isValidWrongSecret = simulator.verifyWarranty(
      'PROD-MONITOR-4K',
      commitmentHash,
      'WRONG_SECRET_ATTEMPT',
      Math.floor(Date.now() / 1000)
    );
    expect(isValidWrongSecret).toBe(false);

    // Attempt with UNREGISTERED commitment hash
    const isValidFakeHash = simulator.verifyWarranty(
      'PROD-MONITOR-4K',
      '0xFAKE_COMMITMENT_HASH_99999999999999999999',
      'correct-secret-dave',
      Math.floor(Date.now() / 1000)
    );
    expect(isValidFakeHash).toBe(false);
  });

  it('5. Claim updates redeemed count - marks warranty redeemed and increments public count', async () => {
    const now = Math.floor(Date.now() / 1000);
    const witness: PrivateWitnessData = {
      customerIdentity: 'eve@example.com',
      invoiceNumber: 'INV-2026-5544',
      serialNumber: 'SN-MON-55449',
      purchaseDate: now - 3600,
      warrantySecret: 'secret-eve-5544'
    };

    const commitmentHash = await computeWarrantyCommitment({
      productId: 'PROD-MONITOR-4K',
      ...witness
    });

    simulator.registerWarranty('PROD-MONITOR-4K', 365 * 24 * 3600, commitmentHash, witness);
    expect(simulator.getStatistics().redeemedCount).toBe(0);
    expect(simulator.isClaimed(commitmentHash)).toBe(false);

    // Submit claim
    const claimSuccess = simulator.claimWarranty(commitmentHash, 'secret-eve-5544', now);
    expect(claimSuccess).toBe(true);
    expect(simulator.getStatistics().redeemedCount).toBe(1);
    expect(simulator.isClaimed(commitmentHash)).toBe(true);

    // Attempt duplicate claim
    const duplicateClaim = simulator.claimWarranty(commitmentHash, 'secret-eve-5544', now);
    expect(duplicateClaim).toBe(false);
    expect(simulator.getStatistics().redeemedCount).toBe(1);
  });

  it('6. Statistics calculation - correctly computes active = issued - redeemed', async () => {
    const now = Math.floor(Date.now() / 1000);

    for (let i = 1; i <= 5; i++) {
      const witness: PrivateWitnessData = {
        customerIdentity: `user${i}@example.com`,
        invoiceNumber: `INV-2026-000${i}`,
        serialNumber: `SN-000${i}`,
        purchaseDate: now,
        warrantySecret: `secret-user-${i}`
      };

      const commitmentHash = await computeWarrantyCommitment({
        productId: 'PROD-MONITOR-4K',
        ...witness
      });

      simulator.registerWarranty('PROD-MONITOR-4K', 365 * 24 * 3600, commitmentHash, witness);
    }

    expect(simulator.getStatistics().issuedCount).toBe(5);
    expect(simulator.getStatistics().activeCount).toBe(5);
    expect(simulator.getStatistics().redeemedCount).toBe(0);

    // Claim user 1 & user 2
    const hash1 = await computeWarrantyCommitment({
      productId: 'PROD-MONITOR-4K',
      customerIdentity: 'user1@example.com',
      invoiceNumber: 'INV-2026-0001',
      serialNumber: 'SN-0001',
      purchaseDate: now,
      warrantySecret: 'secret-user-1'
    });
    const hash2 = await computeWarrantyCommitment({
      productId: 'PROD-MONITOR-4K',
      customerIdentity: 'user2@example.com',
      invoiceNumber: 'INV-2026-0002',
      serialNumber: 'SN-0002',
      purchaseDate: now,
      warrantySecret: 'secret-user-2'
    });

    simulator.claimWarranty(hash1, 'secret-user-1', now);
    simulator.claimWarranty(hash2, 'secret-user-2', now);

    const finalStats = simulator.getStatistics();
    expect(finalStats.issuedCount).toBe(5);
    expect(finalStats.redeemedCount).toBe(2);
    expect(finalStats.activeCount).toBe(3); // 5 issued - 2 redeemed = 3 active
  });
});
