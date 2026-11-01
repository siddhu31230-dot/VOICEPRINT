import { performance } from 'node:perf_hooks';

async function benchmarkPbkdf2() {
  const enc = new TextEncoder();
  const passphrase = 'CandidateVerificationPassphrase!2026';
  const salt = crypto.getRandomValues(new Uint8Array(16));

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  const iterationCounts = [100000, 300000, 600000];
  console.log('--- PBKDF2-HMAC-SHA256 ITERATION BENCHMARK ---');

  for (const iterations of iterationCounts) {
    const runs = 5;
    const times = [];

    for (let r = 0; r < runs; r++) {
      const t0 = performance.now();
      await crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt,
          iterations,
          hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      );
      const t1 = performance.now();
      times.push(t1 - t0);
    }

    const avg = times.reduce((a, b) => a + b, 0) / runs;
    const min = Math.min(...times);
    const max = Math.max(...times);
    console.log(`Iterations: ${iterations.toLocaleString()} | Avg: ${avg.toFixed(2)}ms | Min: ${min.toFixed(2)}ms | Max: ${max.toFixed(2)}ms`);
  }
}

benchmarkPbkdf2().catch(console.error);
