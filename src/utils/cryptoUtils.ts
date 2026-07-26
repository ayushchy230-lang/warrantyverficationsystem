/**
 * Zero-Knowledge & Cryptographic Helper Utilities
 * Generates client-side commitments for Midnight private witnesses.
 */

export async function hashString(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return '0x' + hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export interface WarrantyWitnessInputs {
  productId: string;
  serialNumber: string;
  invoiceNumber: string;
  customerIdentity: string;
  warrantySecret: string;
  purchaseDate: number;
}

/**
 * Computes a unique Midnight zero-knowledge commitment hash from private witness details.
 * Commitment = Hash(productId || serialNumber || invoiceNumber || customerIdentity || warrantySecret || purchaseDate)
 */
export async function computeWarrantyCommitment(inputs: WarrantyWitnessInputs): Promise<string> {
  const payload = [
    inputs.productId.trim(),
    inputs.serialNumber.trim(),
    inputs.invoiceNumber.trim(),
    inputs.customerIdentity.trim().toLowerCase(),
    inputs.warrantySecret.trim(),
    inputs.purchaseDate.toString()
  ].join('|');

  return await hashString(payload);
}

/**
 * Generates a random secure hex warranty secret if user doesn't provide one
 */
export function generateRandomSecret(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Formats unix timestamp into readable locale string
 */
export function formatTimestamp(seconds: number): string {
  if (!seconds) return 'N/A';
  return new Date(seconds * 1000).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}
