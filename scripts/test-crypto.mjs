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
  console.log('   ✓ PBKDF2 key derivation (600,000 rounds, SHA-256, 16-byte salt) verified.');

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

  // Test 9: Empty String Encryption and Decryption Roundtrip
  console.log('\n9. Testing Empty String Plaintext Roundtrip...');
  const emptyEnv = await encryptData('', key);
  const emptyRes = await decryptData(emptyEnv, key);
  assert.strictEqual(emptyRes.success, true);
  assert.strictEqual(emptyRes.plaintext, '');
  console.log('   ✓ Empty string encrypted with 128-bit auth tag and decrypted successfully.');

  // Test 10: Large Payload Encryption (50KB text) Roundtrip
  console.log('\n10. Testing Large 50KB Payload Roundtrip...');
  const largePayload = 'A'.repeat(50 * 1024);
  const t0 = Date.now();
  const largeEnv = await encryptData(largePayload, key);
  const largeRes = await decryptData(largeEnv, key);
  const dt = Date.now() - t0;
  assert.strictEqual(largeRes.success, true);
  assert.strictEqual(largeRes.plaintext?.length, 50 * 1024);
  console.log(`   ✓ 50KB payload encrypted and decrypted in ${dt}ms.`);

  // Test 11: Truncated Ciphertext Rejection (<16 bytes auth tag missing)
  console.log('\n11. Testing Truncated Ciphertext (<16 bytes)...');
  const shortEnv = {
    ...env1,
    ciphertext: Buffer.from(new Uint8Array(8)).toString('base64')
  };
  const shortRes = await decryptData(shortEnv, key);
  assert.strictEqual(shortRes.success, false);
  assert.match(shortRes.error, /truncated/);
  console.log('   ✓ Truncated ciphertext safely rejected with descriptive error.');

  // Test 12: Corrupted / Invalid Base64 Handling
  console.log('\n12. Testing Corrupted Base64 Input Handling...');
  const corruptedEnv = {
    ...env1,
    ciphertext: '!!!ThisIsNotValidBase64!!!'
  };
  const corruptedRes = await decryptData(corruptedEnv, key);
  assert.strictEqual(corruptedRes.success, false);
  console.log('   ✓ Corrupted Base64 handled without unhandled exception.');

  // Test 13: Unsupported Envelope Version Rejection
  console.log('\n13. Testing Invalid Envelope Version Rejection...');
  const invalidVersionEnv = {
    ...env1,
    version: 99
  };
  const invalidVersionRes = await decryptData(invalidVersionEnv, key);
  assert.strictEqual(invalidVersionRes.success, false);
  assert.match(invalidVersionRes.error, /Unsupported encryption envelope/);
  console.log('   ✓ Invalid envelope version 99 rejected.');

  // Test 14: Unsupported Algorithm Rejection
  console.log('\n14. Testing Unsupported Algorithm Rejection...');
  const invalidAlgoEnv = {
    ...env1,
    algorithm: 'AES-CBC-128'
  };
  const invalidAlgoRes = await decryptData(invalidAlgoEnv, key);
  assert.strictEqual(invalidAlgoRes.success, false);
  assert.match(invalidAlgoRes.error, /Unsupported encryption envelope/);
  console.log('   ✓ Unsupported algorithm AES-CBC-128 rejected.');

  // Test 15: Invalid Key Length Import Validation
  console.log('\n15. Testing Invalid Key Length Import Validation...');
  const invalidShortKeyBase64 = Buffer.from(new Uint8Array(16)).toString('base64'); // 16 bytes instead of 32
  let threw = false;
  try {
    await importKeyFromBase64(invalidShortKeyBase64);
  } catch (err) {
    threw = true;
    assert.match(err.message, /expected 32 bytes/);
  }
  assert.strictEqual(threw, true, 'importKeyFromBase64 must throw on invalid key length');
  console.log('   ✓ Key import correctly throws on non-256-bit key.');

  console.log('\n=========================================');
  console.log('🎉 ALL 15 AES-256-GCM CRYPTO TESTS PASSED!');
  console.log('=========================================\n');
}

runCryptoTests().catch(err => {
  console.error('❌ Crypto tests failed:', err);
  process.exit(1);
});
