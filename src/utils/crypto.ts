/**
 * VOICEPRINT Client-Side Cryptographic Vault
 * 
 * Standard: AES-256-GCM Authenticated Encryption via Web Crypto API (SubtleCrypto)
 * 
 * Key Principles & Invariants:
 * 1. Algorithm: AES-GCM with 256-bit key length and 128-bit authentication tag.
 * 2. Nonce/IV: Fresh, cryptographically secure 12-byte (96-bit) IV generated via
 *    crypto.getRandomValues() for EVERY single encryption operation. IVs are NEVER reused.
 * 3. Authenticity: GCM ensures both confidentiality and integrity. If any single bit of
 *    ciphertext or IV is modified, decryption fails with an authentication error.
 * 4. Key Management: Keys are held strictly in runtime memory (CryptoKey) during active sessions.
 *    No encryption keys are ever saved to localStorage, sessionStorage, or indexedDB.
 * 5. Separation: No keys or sensitive ciphertexts are transmitted to the Gemma AI backend.
 */

export interface EncryptedEnvelope {
  version: 1;
  algorithm: 'AES-GCM-256';
  iv: string; // Base64-encoded 12-byte initialization vector
  ciphertext: string; // Base64-encoded ciphertext + 16-byte auth tag
  salt?: string; // Base64-encoded PBKDF2 salt (if key derived from passphrase)
  tagLengthBits: 128;
  createdAt: string; // ISO 8601 timestamp
}

export interface DecryptionResult {
  success: boolean;
  plaintext?: string;
  error?: string;
}

// ==========================================
// Base64 & Buffer Conversion Utilities
// ==========================================

export function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function base64ToBuffer(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// ==========================================
// Key Generation & Derivation
// ==========================================

/**
 * Generates an ephemeral 256-bit AES-GCM key in memory.
 */
export async function generateAes256GcmKey(): Promise<CryptoKey> {
  const subtle = getSubtleCrypto();
  return subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable (allows manual user-held backup export, never stored in web storage)
    ['encrypt', 'decrypt']
  );
}

/**
 * Derives a 256-bit AES-GCM key from a user-supplied passphrase using PBKDF2 with SHA-256.
 * Salt: 16 bytes of cryptographically secure random entropy.
 * Iterations: 100,000 rounds.
 */
export async function deriveKeyFromPassphrase(
  passphrase: string,
  existingSalt?: Uint8Array
): Promise<{ key: CryptoKey; salt: Uint8Array }> {
  const subtle = getSubtleCrypto();
  const enc = new TextEncoder();
  const keyMaterial = await subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const salt = existingSalt || crypto.getRandomValues(new Uint8Array(16));

  const key = await subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );

  return { key, salt };
}

/**
 * Exports a CryptoKey to a raw Base64 string for user-held key backup.
 */
export async function exportKeyToBase64(key: CryptoKey): Promise<string> {
  const subtle = getSubtleCrypto();
  const exported = await subtle.exportKey('raw', key);
  return bufferToBase64(exported);
}

/**
 * Imports a raw 256-bit Base64 string into a CryptoKey in memory.
 */
export async function importKeyFromBase64(base64Key: string): Promise<CryptoKey> {
  const subtle = getSubtleCrypto();
  const rawBytes = base64ToBuffer(base64Key);
  if (rawBytes.length !== 32) {
    throw new Error(`Invalid key length: expected 32 bytes (256-bit), got ${rawBytes.length} bytes.`);
  }
  return subtle.importKey(
    'raw',
    rawBytes as unknown as BufferSource,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// ==========================================
// AES-256-GCM Encryption & Decryption
// ==========================================

/**
 * Encrypts plaintext string using AES-256-GCM with a fresh 12-byte IV.
 * Produces an authenticated versioned envelope containing ciphertext, tag, and IV.
 */
export async function encryptData(
  plaintext: string,
  key: CryptoKey,
  salt?: Uint8Array
): Promise<EncryptedEnvelope> {
  const subtle = getSubtleCrypto();
  const enc = new TextEncoder();
  const encodedPlaintext = enc.encode(plaintext);

  // Fresh 12-byte (96-bit) cryptographically secure initialization vector
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Perform AES-GCM authenticated encryption (128-bit tag appended automatically)
  const ciphertextBuffer = await subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv as unknown as BufferSource,
      tagLength: 128, // 128-bit authentication tag
    },
    key,
    encodedPlaintext
  );

  return {
    version: 1,
    algorithm: 'AES-GCM-256',
    iv: bufferToBase64(iv),
    ciphertext: bufferToBase64(ciphertextBuffer),
    salt: salt ? bufferToBase64(salt) : undefined,
    tagLengthBits: 128,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Decrypts an EncryptedEnvelope using the supplied CryptoKey.
 * Validates GCM authentication tag. If ciphertext or IV is tampered with,
 * returns a safe error without crashing or throwing unhandled exceptions.
 */
export async function decryptData(
  envelope: EncryptedEnvelope,
  key: CryptoKey
): Promise<DecryptionResult> {
  try {
    if (!envelope || envelope.version !== 1 || envelope.algorithm !== 'AES-GCM-256') {
      return {
        success: false,
        error: 'Unsupported encryption envelope version or algorithm.',
      };
    }

    const subtle = getSubtleCrypto();
    const iv = base64ToBuffer(envelope.iv);
    if (iv.length !== 12) {
      return {
        success: false,
        error: `Invalid IV length: expected 12 bytes, got ${iv.length}.`,
      };
    }

    const ciphertext = base64ToBuffer(envelope.ciphertext);
    if (ciphertext.length < 16) {
      return {
        success: false,
        error: 'Ciphertext is truncated (missing 128-bit authentication tag).',
      };
    }

    const decryptedBuffer = await subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv as unknown as BufferSource,
        tagLength: 128,
      },
      key,
      ciphertext as unknown as BufferSource
    );

    const dec = new TextDecoder();
    return {
      success: true,
      plaintext: dec.decode(decryptedBuffer),
    };
  } catch (err: any) {
    // Web Crypto throws DOMException / OperationError when GCM tag verification fails
    return {
      success: false,
      error: 'Authentication failed: ciphertext has been modified, tampered with, or key is invalid.',
    };
  }
}

/**
 * Utility helper to safely simulate tampering for verification and security demonstration.
 * Flips bits in the ciphertext to prove GCM authentication failure.
 */
export function tamperEnvelope(envelope: EncryptedEnvelope): EncryptedEnvelope {
  const bytes = base64ToBuffer(envelope.ciphertext);
  if (bytes.length > 0) {
    // Flip bits in the middle of ciphertext
    const targetIdx = Math.floor(bytes.length / 2);
    bytes[targetIdx] ^= 0xff;
  }
  return {
    ...envelope,
    ciphertext: bufferToBase64(bytes),
  };
}

function getSubtleCrypto(): SubtleCrypto {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    return window.crypto.subtle;
  }
  if (typeof globalThis !== 'undefined' && globalThis.crypto && globalThis.crypto.subtle) {
    return globalThis.crypto.subtle;
  }
  throw new Error('Web Crypto API (SubtleCrypto) is not supported in this runtime environment.');
}
