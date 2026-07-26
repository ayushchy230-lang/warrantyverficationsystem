/**
 * Midnight Confidential Product Warranty Verification Contract Simulator
 * Replicates the state transitions, witness verification, and zero-knowledge output behavior
 * of warranty.compact for client-side and unit testing environments.
 */

export interface PrivateWitnessData {
  customerIdentity: string;
  invoiceNumber: string;
  serialNumber: string;
  purchaseDate: number; // Unix timestamp in seconds
  warrantySecret: string;
  ownershipProof?: string;
}

export interface WarrantyRecord {
  commitmentHash: string;
  productId: string;
  expiryTimestamp: number;
  registeredAt: number;
}

export class MidnightWarrantyContractSimulator {
  public productId: string = 'PROD-9901';
  public warrantyIssuer: string = '0xMIDNIGHT_MANUFACTURER_ISSUER';
  public defaultDuration: number = 365 * 24 * 3600; // 1 year default
  public issuedCount: number = 0;
  public redeemedCount: number = 0;
  public contractOwner: string = '0xMIDNIGHT_CONTRACT_OWNER';

  private registeredCommitments: Map<string, WarrantyRecord> = new Map();
  private claimedCommitments: Set<string> = new Set();
  private witnessStore: Map<string, PrivateWitnessData> = new Map();

  constructor(initialProductId: string = 'PROD-9901', initialDurationSeconds: number = 31536000) {
    this.productId = initialProductId;
    this.defaultDuration = initialDurationSeconds;
  }

  /**
   * Compact Circuit: registerWarranty
   * Manufacturer registers a new confidential warranty commitment on-chain.
   */
  public registerWarranty(
    productId: string,
    durationSeconds: number,
    commitmentHash: string,
    witness?: PrivateWitnessData
  ): { success: boolean; commitmentHash: string } {
    if (!commitmentHash || commitmentHash.trim() === '') {
      throw new Error('Invalid commitment hash');
    }

    const now = Math.floor(Date.now() / 1000);
    const purchaseDate = witness?.purchaseDate || now;
    const expiryTimestamp = purchaseDate + durationSeconds;

    this.registeredCommitments.set(commitmentHash, {
      commitmentHash,
      productId,
      expiryTimestamp,
      registeredAt: now
    });

    if (witness) {
      this.witnessStore.set(commitmentHash, witness);
    }

    this.issuedCount += 1;
    this.productId = productId;
    this.defaultDuration = durationSeconds;

    return {
      success: true,
      commitmentHash
    };
  }

  /**
   * Compact Circuit: verifyWarranty
   * Customer submits ZK proof privately.
   * Discloses ONLY boolean result: valid (true) or invalid (false).
   * No purchase details, customer name, serial, or invoice become public.
   */
  public verifyWarranty(
    productId: string,
    commitmentHash: string,
    warrantySecret: string,
    currentTimestamp: number = Math.floor(Date.now() / 1000)
  ): boolean {
    const record = this.registeredCommitments.get(commitmentHash);

    if (!record) {
      return false; // Invalid proof or un-registered commitment
    }

    if (record.productId !== productId) {
      return false;
    }

    // Check expiry
    if (currentTimestamp > record.expiryTimestamp) {
      return false; // Expired warranty
    }

    // Verify witness secret matching if witness is stored
    const witness = this.witnessStore.get(commitmentHash);
    if (witness && witness.warrantySecret !== warrantySecret) {
      return false; // Invalid proof secret
    }

    // Disclose result: ONLY boolean
    return true;
  }

  /**
   * Compact Circuit: claimWarranty
   * Customer claims warranty redemption.
   * Increments public redeemedCount without exposing customer details.
   */
  public claimWarranty(
    commitmentHash: string,
    warrantySecret: string,
    currentTimestamp: number = Math.floor(Date.now() / 1000)
  ): boolean {
    const record = this.registeredCommitments.get(commitmentHash);

    if (!record) {
      return false;
    }

    if (this.claimedCommitments.has(commitmentHash)) {
      return false; // Already redeemed
    }

    if (currentTimestamp > record.expiryTimestamp) {
      return false; // Expired
    }

    const witness = this.witnessStore.get(commitmentHash);
    if (witness && witness.warrantySecret !== warrantySecret) {
      return false;
    }

    this.claimedCommitments.add(commitmentHash);
    this.redeemedCount += 1;

    return true;
  }

  /**
   * Compact Public State Getter: getStatistics
   */
  public getStatistics(): {
    issuedCount: number;
    redeemedCount: number;
    activeCount: number;
    productId: string;
    warrantyIssuer: string;
    contractOwner: string;
  } {
    const activeCount = Math.max(0, this.issuedCount - this.redeemedCount);
    return {
      issuedCount: this.issuedCount,
      redeemedCount: this.redeemedCount,
      activeCount,
      productId: this.productId,
      warrantyIssuer: this.warrantyIssuer,
      contractOwner: this.contractOwner
    };
  }

  public isClaimed(commitmentHash: string): boolean {
    return this.claimedCommitments.has(commitmentHash);
  }

  public resetState() {
    this.issuedCount = 0;
    this.redeemedCount = 0;
    this.registeredCommitments.clear();
    this.claimedCommitments.clear();
    this.witnessStore.clear();
  }
}
