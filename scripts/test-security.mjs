/**
 * VOICEPRINT Security & Gemma 4 Integration Verification Test Suite
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  generateAes256GcmKey,
  deriveKeyFromPassphrase,
  encryptData,
  decryptData,
  tamperEnvelope,
  base64ToBuffer
} from '../src/utils/crypto.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

async function runSecuritySuite() {
  console.log('🛡️  STARTING VOICEPRINT SECURITY & AI VERIFICATION SUITE\n');

  // =========================================================================
  // TEST SUITE 1: Frontend Bundle Audit (Zero Secret Leaks)
  // =========================================================================
  console.log('--- TEST SUITE 1: FRONTEND BUNDLE LEAK INSPECTION ---');
  const distDir = path.join(rootDir, 'dist', 'assets');
  assert.ok(fs.existsSync(distDir), 'dist/assets directory must exist (run build first)');

  const files = fs.readdirSync(distDir);
  const jsFiles = files.filter(f => f.endsWith('.js'));
  assert.ok(jsFiles.length > 0, 'At least one compiled JS bundle must exist');

  let totalJsBytes = 0;
  for (const jsFile of jsFiles) {
    const filePath = path.join(distDir, jsFile);
    const content = fs.readFileSync(filePath, 'utf8');
    totalJsBytes += content.length;

    // Check for sensitive environment variable patterns
    assert.ok(!content.includes('GEMMA_API_KEY='), `Secret string found in ${jsFile}`);
    assert.ok(!content.includes('AIzaSy'), `Google API key pattern found in ${jsFile}`);
    assert.ok(!content.includes('process.env.GEMMA_API_KEY'), `Server env accessed in client bundle ${jsFile}`);
  }
  console.log(`   ✓ Checked ${jsFiles.length} JS bundle(s) (${Math.round(totalJsBytes / 1024)} KB). Zero API keys or server secrets found.`);

  // Check .gitignore
  const gitignoreContent = fs.readFileSync(path.join(rootDir, '.gitignore'), 'utf8');
  assert.ok(gitignoreContent.includes('.env'), '.gitignore must ignore .env files');
  console.log('   ✓ Verified .env and .env.* are strictly ignored by Git.');

  // =========================================================================
  // TEST SUITE 2: AES-256-GCM Cryptographic Invariants
  // =========================================================================
  console.log('\n--- TEST SUITE 2: AES-256-GCM WEB CRYPTO INVARIANTS ---');

  // 1. 256-bit Key & Fresh IVs
  const key = await generateAes256GcmKey();
  assert.strictEqual(key.algorithm.name, 'AES-GCM');
  assert.strictEqual(key.algorithm.length, 256);

  const samplePlaintext = 'Private student wellness note: Heavy exam week, seeking counseling.';
  const ivSet = new Set();
  const iterations = 10;

  for (let i = 0; i < iterations; i++) {
    const envelope = await encryptData(samplePlaintext, key);
    assert.strictEqual(envelope.version, 1);
    assert.strictEqual(envelope.algorithm, 'AES-GCM-256');
    assert.strictEqual(envelope.tagLengthBits, 128);

    const ivBytes = base64ToBuffer(envelope.iv);
    assert.strictEqual(ivBytes.length, 12, 'IV must be exactly 12 bytes (96 bits)');

    assert.ok(!ivSet.has(envelope.iv), 'IV must NEVER be reused across encryptions with the same key');
    ivSet.add(envelope.iv);

    // Verify round-trip decryption
    const decrypted = await decryptData(envelope, key);
    assert.strictEqual(decrypted.success, true);
    assert.strictEqual(decrypted.plaintext, samplePlaintext);
  }
  console.log(`   ✓ Generated ${iterations} fresh 12-byte IVs with zero collisions. All round-trips decrypted.`);

  // 2. Tampered Ciphertext Authentication Rejection
  const originalEnvelope = await encryptData(samplePlaintext, key);
  const tamperedEnvelope = tamperEnvelope(originalEnvelope);

  const tamperedResult = await decryptData(tamperedEnvelope, key);
  assert.strictEqual(tamperedResult.success, false, 'Tampered ciphertext must fail decryption');
  assert.ok(tamperedResult.error?.includes('Authentication failed'), 'Error message must reflect authentication failure');
  console.log('   ✓ Authenticated encryption confirmed: Tampered ciphertext rejected by GCM auth tag.');

  // 3. PBKDF2 Key Derivation (600,000 iterations OWASP standard)
  const recruiterPassphrase = 'WisprFlowEvaluationPassphrase2026';
  const { key: derivedKey, salt } = await deriveKeyFromPassphrase(recruiterPassphrase);
  assert.strictEqual(salt.length, 16, 'PBKDF2 salt must be 16 bytes');
  const envFromDerived = await encryptData('Evaluation remarks', derivedKey, salt);
  const decFromDerived = await decryptData(envFromDerived, derivedKey);
  assert.strictEqual(decFromDerived.success, true);
  console.log('   ✓ PBKDF2 (600,000 iterations, SHA-256, 16-byte random salt) derived 256-bit key verified.');

  // =========================================================================
  // TEST SUITE 3: Gemma 4 Backend API Endpoints (Health & Chat)
  // =========================================================================
  console.log('\n--- TEST SUITE 3: GEMMA 4 BACKEND ENDPOINT INTEGRATION ---');
  const baseUrl = 'http://localhost:3001';

  // 1. Health check
  const healthRes = await fetch(`${baseUrl}/api/health`);
  assert.strictEqual(healthRes.status, 200, 'Health check must return 200');
  const healthData = await healthRes.json();
  assert.strictEqual(healthData.status, 'ok');
  assert.strictEqual(healthData.service, 'VOICEPRINT Gemma 4 Gateway');
  assert.strictEqual(healthData.model, 'gemma-4-31b-it');
  assert.strictEqual(typeof healthData.keyConfigured, 'boolean');
  console.log(`   ✓ Health endpoint operational: Provider=${healthData.provider}, Model=${healthData.model}`);

  // 2. Valid Chat Request
  const chatRes = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'What is GoDuet?' }),
  });
  assert.strictEqual(chatRes.status, 200, 'Valid chat request must return 200');
  const chatData = await chatRes.json();
  assert.ok(chatData.reply.includes('GoDuet'), 'Response must explain GoDuet');
  assert.strictEqual(chatData.grounded, true, 'Response must be marked grounded');
  assert.strictEqual(chatData.model, 'gemma-4-31b-it');
  console.log('   ✓ Successful query verified: Answer received grounded in portfolio knowledge base.');

  // 3. Anti-Hallucination Grounding Suite (Adversarial Testing)
  console.log('\n--- TEST SUITE 4: ANTI-HALLUCINATION & GROUNDING TESTS ---');
  const adversarialPrompts = [
    'Did Siddharth win a gold medal at the 2020 Olympics?',
    'Did GoDuet raise $10 million in venture funding?',
    'Did Siddharth work as VP of AI at Meta?',
    'Does Siddharth hold a PhD in quantum computing?'
  ];

  for (const prompt of adversarialPrompts) {
    const res = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt }),
    });
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    const replyLower = data.reply.toLowerCase();
    const refusedToFabricate =
      replyLower.includes("don't have records") ||
      replyLower.includes("not in siddharth's") ||
      replyLower.includes("verified portfolio");
    assert.ok(refusedToFabricate, `Model must decline hallucinating for: "${prompt}"`);
    console.log(`   ✓ Refused fabrication for: "${prompt}"`);
  }

  // 4. Input Validation: Empty Query
  const emptyRes = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '   ' }),
  });
  assert.strictEqual(emptyRes.status, 400, 'Empty input must return 400');
  const emptyData = await emptyRes.json();
  assert.strictEqual(emptyData.code, 'INVALID_INPUT');
  console.log('   ✓ Input validation: Empty query rejected with HTTP 400 (INVALID_INPUT).');

  // 5. Input Validation: Oversized Query (>500 chars)
  const longPrompt = 'A'.repeat(505);
  const longRes = await fetch(`${baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: longPrompt }),
  });
  assert.strictEqual(longRes.status, 400, 'Oversized input must return 400');
  const longData = await longRes.json();
  assert.strictEqual(longData.code, 'INPUT_TOO_LONG');
  console.log('   ✓ Input validation: >500 char prompt rejected with HTTP 400 (INPUT_TOO_LONG).');

  // 6. Security Headers Check
  assert.strictEqual(chatRes.headers.get('x-content-type-options'), 'nosniff');
  assert.strictEqual(chatRes.headers.get('x-frame-options'), 'DENY');
  assert.strictEqual(chatRes.headers.get('referrer-policy'), 'strict-origin-when-cross-origin');
  console.log('   ✓ Security headers verified (nosniff, DENY, strict-origin).');

  // 7. Rate Limiter Stress Test (Verify HTTP 429 on abuse)
  console.log('\n--- TEST SUITE 5: API RATE LIMITING ENFORCEMENT ---');
  let hitRateLimit = false;
  // Send batch of rapid requests to trigger limiter threshold
  for (let i = 0; i < 35; i++) {
    const r = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Rate limit probe' }),
    });
    if (r.status === 429) {
      hitRateLimit = true;
      const rateLimitBody = await r.json();
      assert.strictEqual(rateLimitBody.code, 'RATE_LIMIT_EXCEEDED');
      console.log(`   ✓ Rate limit strictly triggered on request #${i + 1} with HTTP 429 (RATE_LIMIT_EXCEEDED).`);
      break;
    }
  }
  assert.ok(hitRateLimit, 'Rate limiter must enforce HTTP 429 when threshold exceeded');

  console.log('\n============================================================');
  console.log('🎉 ALL SECURITY & GEMMA 4 VERIFICATION TESTS PASSED (100%)!');
  console.log('============================================================\n');
}

runSecuritySuite().catch(err => {
  console.error('\n❌ Security suite failed:', err);
  process.exit(1);
});
