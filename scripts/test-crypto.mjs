import assert from 'node:assert';
import {
  generateAes256GcmKey,
  deriveKeyFromPassphrase,
  exportKeyToBase64,
  importKeyFromBase64,
  encryptData,
  decryptData,
  tamperEnvelope,
  base64ToBuffer
} from '../src/utils/crypto.ts';

async function runCryptoTests() {
  console.log('🧪 Starting AES-256-GCM Web Crypto Unit Tests...\n');

  // Test 1: Key Generation
  console.log('1. Testing 256-bit AES-GCM Key Generation...');
  const key = await generateAes256GcmKey();
  assert.strictEqual(key.algorithm.name, 'AES-GCM');
  assert.strictEqual(key.algorithm.length, 256);
  assert.strictEqual(key.type, 'secret');
  console.log('   ✓ Key generated with algorithm AES-GCM and length 256 bits.');

  // Test 2: Key Export and Import
  console.log('\n2. Testing Key Export / Import roundtrip...');
  const exported = await exportKeyToBase64(key);
  const rawBytes = base64ToBuffer(exported);
  assert.strictEqual(rawBytes.length, 32, 'Raw key must be exactly 32 bytes (256 bits)');
  const importedKey = await importKeyFromBase64(exported);
  assert.strictEqual(importedKey.algorithm.name, 'AES-GCM');
  assert.strictEqual(importedKey.algorithm.length, 256);
  console.log('   ✓ Raw key exported to Base64 (32 bytes) and imported successfully.');

  // Test 3: Passphrase Derivation via PBKDF2
  console.log('\n3. Testing Passphrase Key Derivation via PBKDF2...');
  const passphrase = 'Ultra-Secure-Recruiter-Key-2026!';
  const { key: derivedKey1, salt } = await deriveKeyFromPassphrase(passphrase);
  assert.strictEqual(salt.length, 16, 'Salt must be 16 bytes');
  // Re-derive with same passphrase and salt -> must yield identical key
  const { key: derivedKey2 } = await deriveKeyFromPassphrase(passphrase, salt);
  const exp1 = await exportKeyToBase64(derivedKey1);
  const exp2 = await exportKeyToBase64(derivedKey2);
  assert.strictEqual(exp1, exp2, 'Identical passphrase + salt must derive identical 256-bit key');
  console.log('   ✓ PBKDF2 key derivation (100,000 rounds, SHA-256, 16-byte salt) verified.');

  // Test 4: Fresh IV Generation Invariant (No IV Reuse)
  console.log('\n4. Testing Fresh IV Generation Invariant (Never reuse IVs)...');
  const secretText = 'Confidential Candidate Evaluation Note: Highly analytical builder.';
  const env1 = await encryptData(secretText, key);
  const env2 = await encryptData(secretText, key);
  const env3 = await encryptData(secretText, key);

  assert.notStrictEqual(env1.iv, env2.iv, 'IVs between operations must never be identical');
  assert.notStrictEqual(env2.iv, env3.iv, 'IVs between operations must never be identical');
  assert.strictEqual(base64ToBuffer(env1.iv).length, 12, 'IV must be exactly 12 bytes (96 bits)');
  assert.strictEqual(base64ToBuffer(env2.iv).length, 12, 'IV must be exactly 12 bytes (96 bits)');
  assert.strictEqual(env1.version, 1);
  assert.strictEqual(env1.algorithm, 'AES-GCM-256');
  assert.strictEqual(env1.tagLengthBits, 128);
  console.log('   ✓ Verified 3 distinct fresh 12-byte IVs for 3 identical plaintexts.');

  // Test 5: Successful Decryption Round-trip
  console.log('\n5. Testing Encryption and Decryption Round-trip...');
  const res1 = await decryptData(env1, key);
  assert.strictEqual(res1.success, true);
  assert.strictEqual(res1.plaintext, secretText);
  console.log('   ✓ Decrypted text matches original plaintext perfectly.');

  // Test 6: Tamper Detection - Modified Ciphertext Must Fail
  console.log('\n6. Testing Tamper Detection on Ciphertext (GCM Authentication Tag)...');
  const tamperedEnv = tamperEnvelope(env1);
  const tamperedRes = await decryptData(tamperedEnv, key);
  assert.strictEqual(tamperedRes.success, false);
  assert.match(tamperedRes.error, /Authentication failed/);
  console.log('   ✓ Tampered ciphertext safely rejected by GCM authentication tag: "' + tamperedRes.error + '"');

  // Test 7: Tamper Detection - Modified IV Must Fail
  console.log('\n7. Testing Tamper Detection on IV...');
  const ivBytes = base64ToBuffer(env1.iv);
  ivBytes[0] ^= 0x01; // flip 1 bit in IV
  const tamperedIvEnv = {
    ...env1,
    iv: Buffer.from(ivBytes).toString('base64')
  };
  const tamperedIvRes = await decryptData(tamperedIvEnv, key);
  assert.strictEqual(tamperedIvRes.success, false);
  assert.match(tamperedIvRes.error, /Authentication failed/);
  console.log('   ✓ Modified IV safely rejected by GCM authentication tag.');

  // Test 8: Wrong Key Must Fail
  console.log('\n8. Testing Decryption with Wrong Key...');
  const wrongKey = await generateAes256GcmKey();
  const wrongKeyRes = await decryptData(env1, wrongKey);
  assert.strictEqual(wrongKeyRes.success, false);
  assert.match(wrongKeyRes.error, /Authentication failed/);
  console.log('   ✓ Wrong key safely rejected by GCM authentication tag.');

  console.log('\n=========================================');
  console.log('🎉 ALL AES-256-GCM CRYPTO TESTS PASSED!');
  console.log('=========================================\n');
}

runCryptoTests().catch(err => {
  console.error('❌ Crypto tests failed:', err);
  process.exit(1);
});
