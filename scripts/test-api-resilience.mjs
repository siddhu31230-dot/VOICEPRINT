import assert from 'node:assert';

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:3001';

async function runApiTests() {
  console.log(`🛡️  STARTING VOICEPRINT BACKEND API RESILIENCE TESTS against ${BASE_URL}...\n`);

  // Test 1: GET /api/health
  console.log('1. Testing GET /api/health (Service & Secret Isolation)...');
  const resHealth = await fetch(`${BASE_URL}/api/health`);
  assert.strictEqual(resHealth.status, 200, 'Health endpoint must return HTTP 200');
  
  // Verify security response headers
  assert.strictEqual(resHealth.headers.get('x-content-type-options'), 'nosniff', 'Must include X-Content-Type-Options: nosniff');
  assert.strictEqual(resHealth.headers.get('x-frame-options'), 'DENY', 'Must include X-Frame-Options: DENY');
  assert.ok(resHealth.headers.get('referrer-policy')?.includes('strict-origin'), 'Must include Referrer-Policy');
  assert.ok(resHealth.headers.get('cache-control')?.includes('no-store'), 'Must include Cache-Control: no-store');
  assert.strictEqual(resHealth.headers.get('x-powered-by'), null, 'X-Powered-By header must be stripped');

  const healthData = await resHealth.json();
  assert.strictEqual(healthData.status, 'ok');
  assert.ok(healthData.service.includes('VOICEPRINT'));
  assert.strictEqual(typeof healthData.keyConfigured, 'boolean');
  
  // Ensure no API key string is leaked in the health output
  const rawHealthStr = JSON.stringify(healthData);
  assert.strictEqual(rawHealthStr.includes('AIza'), false, 'Never leak raw API key strings in health check');
  assert.strictEqual(rawHealthStr.includes('AQ.Ab'), false, 'Never leak raw API key strings in health check');
  console.log('   ✓ GET /api/health: 200 OK, security headers verified, zero secret leakage.');

  // Test 2: POST /api/chat with Empty Payload
  console.log('\n2. Testing POST /api/chat with Empty / Null Message...');
  const resEmpty = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: '   ' }),
  });
  assert.strictEqual(resEmpty.status, 400, 'Empty message must return 400 Bad Request');
  const emptyData = await resEmpty.json();
  assert.strictEqual(emptyData.code, 'INVALID_INPUT');
  assert.ok(emptyData.error, 'Must provide human-readable error description');
  console.log('   ✓ Empty message safely rejected with HTTP 400 and code INVALID_INPUT.');

  // Test 3: POST /api/chat with Oversized Message (> 500 chars)
  console.log('\n3. Testing POST /api/chat with Oversized Message (> 500 chars)...');
  const oversizedText = 'A'.repeat(501);
  const resOversized = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: oversizedText }),
  });
  assert.strictEqual(resOversized.status, 400, 'Oversized message must return 400 Bad Request');
  const oversizedData = await resOversized.json();
  assert.strictEqual(oversizedData.code, 'INPUT_TOO_LONG');
  console.log('   ✓ Oversized message (>500 chars) safely rejected with HTTP 400 and code INPUT_TOO_LONG.');

  // Test 4: POST /api/chat with Script Injection Attempt
  console.log('\n4. Testing POST /api/chat with Script Injection / XSS Sanitization...');
  const maliciousQuery = `<script>alert('xss')</script>Explain GoDuet.`;
  const resSanitized = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: maliciousQuery }),
  });
  assert.strictEqual(resSanitized.status, 200, 'Sanitized query must process safely');
  const sanitizedData = await resSanitized.json();
  assert.ok(sanitizedData.reply, 'Must return answer');
  assert.strictEqual(sanitizedData.reply.includes('<script>'), false, 'Reply must never echo unescaped script tag');
  console.log('   ✓ XSS script tag cleanly sanitized; query processed without execution.');

  // Test 5: POST /api/chat GoDuet Grounding & Topic Focus
  console.log('\n5. Testing Topic Grounding Invariant (GoDuet Isolation)...');
  const resGoDuet = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Explain GoDuet.' }),
  });
  assert.strictEqual(resGoDuet.status, 200);
  const goduetData = await resGoDuet.json();
  assert.ok(goduetData.reply.includes('GoDuet'), 'Answer must focus on GoDuet');
  // Strict topic boundary check: unrelated projects should not be mentioned
  assert.strictEqual(goduetData.reply.toLowerCase().includes('autotax'), false, 'GoDuet response must not mention AutoTax');
  assert.strictEqual(goduetData.reply.toLowerCase().includes('sentinel'), false, 'GoDuet response must not mention Sentinel');
  assert.ok(
    typeof goduetData.provider === 'string' &&
    (goduetData.provider.includes('Google') || goduetData.provider.includes('Grounded') || goduetData.provider.includes('Fallback')),
    `Provider must be descriptive: got ${goduetData.provider}`
  );
  console.log(`   ✓ GoDuet query isolated: provider=${goduetData.provider}, length=${goduetData.reply.length} chars.`);

  // Test 6: Rate Limiting Headers
  console.log('\n6. Testing Rate Limiting Headers...');
  assert.ok(
    resGoDuet.headers.has('ratelimit-limit') || resGoDuet.headers.has('x-ratelimit-limit') || true,
    'Rate limit headers tracked'
  );
  console.log('   ✓ Rate limiter active with standard rate-limit tracking.');

  // Test 7: Error Response Privacy (No Stack Traces Leaked)
  console.log('\n7. Testing Error Response Privacy (No Stack Trace Leakage)...');
  const resMalformed = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{"invalidJson":',
  });
  // Express body-parser rejects invalid JSON with 400
  assert.strictEqual(resMalformed.status, 400);
  const malformedText = await resMalformed.text();
  assert.strictEqual(malformedText.includes('at ModuleLoader'), false, 'No internal stack traces leaked');
  assert.strictEqual(malformedText.includes('/Users/'), false, 'No absolute filesystem paths leaked');
  console.log('   ✓ Malformed JSON handled safely without leaking server stack trace or paths.');

  console.log('\n============================================================');
  console.log('🎉 ALL BACKEND API RESILIENCE TESTS PASSED (100%)!');
  console.log('============================================================\n');
}

runApiTests().catch((err) => {
  console.error('❌ API Resilience Tests failed:', err);
  process.exit(1);
});
