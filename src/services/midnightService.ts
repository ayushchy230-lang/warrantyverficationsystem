import { MidnightWarrantyContractSimulator } from '../../contract/warranty_simulator';
import { computeWarrantyCommitment, WarrantyWitnessInputs } from '../utils/cryptoUtils';

export interface WalletState {
  isConnected: boolean;
  address: string | null;
  network: string;
  isProofServerConnected: boolean;
  proofServerUrl: string;
}

export interface VerificationLogItem {
  id: string;
  timestamp: number;
  productId: string;
  action: 'REGISTER' | 'VERIFY' | 'CLAIM';
  status: 'SUCCESS' | 'FAILED';
  commitmentHash: string;
  disclosedResult?: boolean;
}

class MidnightService {
  private simulator: MidnightWarrantyContractSimulator;
  private wallet: WalletState;
  private verificationLogs: VerificationLogItem[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    const network = import.meta.env?.VITE_NETWORK || 'undeployed';
    const proofServerUrl = import.meta.env?.VITE_PROOF_SERVER_URL || 'http://localhost:6300';

    this.simulator = new MidnightWarrantyContractSimulator();
    this.wallet = {
      isConnected: false,
      address: null,
      network: network,
      isProofServerConnected: true,
      proofServerUrl: proofServerUrl
    };

    // Pre-populate demo warranties for initial interactive experience
    this.seedDemoData();
  }

  private async seedDemoData() {
    const sampleWitness: WarrantyWitnessInputs = {
      productId: 'PROD-SMART-TV-4K',
      serialNumber: 'SN-99881122',
      invoiceNumber: 'INV-2026-8801',
      customerIdentity: 'alice@example.com',
      warrantySecret: 'secret-key-alice-777',
      purchaseDate: Math.floor(Date.now() / 1000) - 30 * 24 * 3600 // 30 days ago
    };

    const commitmentHash = await computeWarrantyCommitment(sampleWitness);
    this.simulator.registerWarranty(
      sampleWitness.productId,
      365 * 24 * 3600,
      commitmentHash,
      sampleWitness
    );

    this.verificationLogs.push({
      id: 'log-seed-1',
      timestamp: Math.floor(Date.now() / 1000) - 30 * 24 * 3600,
      productId: sampleWitness.productId,
      action: 'REGISTER',
      status: 'SUCCESS',
      commitmentHash: commitmentHash.slice(0, 10) + '...' + commitmentHash.slice(-8)
    });

    this.notifyListeners();
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((fn) => fn());
  }

  public getWalletState(): WalletState {
    return { ...this.wallet };
  }

  public connectWallet(address: string = '0xMIDNIGHT_USER_WALLET_7719'): WalletState {
    this.wallet.isConnected = true;
    this.wallet.address = address;
    this.notifyListeners();
    return this.getWalletState();
  }

  public disconnectWallet() {
    this.wallet.isConnected = false;
    this.wallet.address = null;
    this.notifyListeners();
  }

  public getStatistics() {
    return this.simulator.getStatistics();
  }

  public getLogs(): VerificationLogItem[] {
    return [...this.verificationLogs];
  }

  /**
   * Register Warranty as Manufacturer
   */
  public async registerWarranty(
    productId: string,
    durationDays: number,
    witness: WarrantyWitnessInputs
  ): Promise<{ success: boolean; commitmentHash: string; message: string }> {
    try {
      const commitmentHash = await computeWarrantyCommitment(witness);
      const durationSeconds = durationDays * 24 * 3600;

      this.simulator.registerWarranty(
        productId,
        durationSeconds,
        commitmentHash,
        witness
      );

      this.verificationLogs.unshift({
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: Math.floor(Date.now() / 1000),
        productId,
        action: 'REGISTER',
        status: 'SUCCESS',
        commitmentHash: commitmentHash.slice(0, 10) + '...' + commitmentHash.slice(-8)
      });

      this.notifyListeners();

      return {
        success: true,
        commitmentHash,
        message: 'Warranty registered successfully on Midnight public ledger!'
      };
    } catch (err: any) {
      return {
        success: false,
        commitmentHash: '',
        message: err.message || 'Failed to register warranty'
      };
    }
  }

  /**
   * Verify Warranty as Customer (Zero Knowledge Proof Execution)
   */
  public async verifyWarranty(
    productId: string,
    serialNumber: string,
    invoiceNumber: string,
    warrantySecret: string,
    customerIdentity: string = '',
    purchaseDateOverride?: number
  ): Promise<{ isValid: boolean; commitmentHash: string; message: string }> {
    try {
      const purchaseDate = purchaseDateOverride || Math.floor(Date.now() / 1000) - 30 * 24 * 3600;

      const witnessInputs: WarrantyWitnessInputs = {
        productId,
        serialNumber,
        invoiceNumber,
        customerIdentity,
        warrantySecret,
        purchaseDate
      };

      const commitmentHash = await computeWarrantyCommitment(witnessInputs);
      const now = Math.floor(Date.now() / 1000);

      const isValid = this.simulator.verifyWarranty(
        productId,
        commitmentHash,
        warrantySecret,
        now
      );

      this.verificationLogs.unshift({
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: now,
        productId,
        action: 'VERIFY',
        status: isValid ? 'SUCCESS' : 'FAILED',
        commitmentHash: commitmentHash.slice(0, 10) + '...' + commitmentHash.slice(-8),
        disclosedResult: isValid
      });

      this.notifyListeners();

      return {
        isValid,
        commitmentHash,
        message: isValid
          ? '✅ Warranty Valid: Proof accepted on Midnight ZK Circuit.'
          : '❌ Invalid Warranty: Expired, incorrect serial/invoice/secret, or un-registered.'
      };
    } catch (err: any) {
      return {
        isValid: false,
        commitmentHash: '',
        message: 'Error executing zero-knowledge proof verification.'
      };
    }
  }

  /**
   * Claim Warranty Redemption
   */
  public async claimWarranty(
    productId: string,
    serialNumber: string,
    invoiceNumber: string,
    warrantySecret: string,
    customerIdentity: string = '',
    purchaseDateOverride?: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const purchaseDate = purchaseDateOverride || Math.floor(Date.now() / 1000) - 30 * 24 * 3600;

      const witnessInputs: WarrantyWitnessInputs = {
        productId,
        serialNumber,
        invoiceNumber,
        customerIdentity,
        warrantySecret,
        purchaseDate
      };

      const commitmentHash = await computeWarrantyCommitment(witnessInputs);
      const now = Math.floor(Date.now() / 1000);

      const success = this.simulator.claimWarranty(commitmentHash, warrantySecret, now);

      this.verificationLogs.unshift({
        id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: now,
        productId,
        action: 'CLAIM',
        status: success ? 'SUCCESS' : 'FAILED',
        commitmentHash: commitmentHash.slice(0, 10) + '...' + commitmentHash.slice(-8)
      });

      this.notifyListeners();

      return {
        success,
        message: success
          ? '🎉 Warranty successfully claimed! Public ledger updated.'
          : '❌ Claim failed: Warranty already redeemed, expired, or invalid secret.'
      };
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Error processing warranty claim.'
      };
    }
  }

  public getRawSimulator() {
    return this.simulator;
  }
}

export const midnightService = new MidnightService();
