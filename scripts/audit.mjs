import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const outDir = '/Users/siddharthsingh/.gemini/antigravity/brain/613aa3cc-148c-42e7-a671-9d6e57466296/scratch/screenshots';
fs.mkdirSync(outDir, { recursive: true });

async function runAudit() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const consoleLogs = [];
  const pageErrors = [];

  const page = await browser.newPage();
  
  page.on('console', msg => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  page.on('pageerror', err => {
    pageErrors.push(err.toString());
  });

  // 1. DESKTOP VIEWPORT AUDIT (1440x900)
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3001/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  // Full page screenshot
  await page.screenshot({ path: path.join(outDir, 'desktop_fullpage.png'), fullPage: true });

  // Section screenshots
  const sections = ['home', 'origin', 'experiments', 'voice-lab', 'growth-arena', 'ask-me', 'next-chapter', 'contact'];
  for (const s of sections) {
    const el = await page.$(`#${s}`);
    if (el) {
      await el.screenshot({ path: path.join(outDir, `desktop_sec_${s}.png`) });
    }
  }

  // Check horizontal overflow on desktop
  const desktopOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  // Test Modal Interaction
  const caseStudyBtn = await page.$('#experiments button');
  if (caseStudyBtn) {
    await caseStudyBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(outDir, 'desktop_modal_open.png') });
    // Close modal
    const closeBtn = await page.$('button[aria-label="Close modal"]');
    if (closeBtn) await closeBtn.click();
    await new Promise(r => setTimeout(r, 400));
  }

  // 2. MOBILE VIEWPORT AUDIT (390x844 - iPhone)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.reload({ waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  await page.screenshot({ path: path.join(outDir, 'mobile_fullpage.png'), fullPage: true });
  await page.screenshot({ path: path.join(outDir, 'mobile_hero.png') });

  // Check mobile horizontal overflow
  const mobileOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > window.innerWidth;
  });

  // Mobile drawer test
  const mobileMenuBtn = await page.$('button[aria-label="Toggle Navigation Menu"]');
  if (mobileMenuBtn) {
    await mobileMenuBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(outDir, 'mobile_menu_open.png') });
  }

  // Collect all links & check anchors
  const linkAudit = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a'));
    return anchors.map(a => ({
      href: a.getAttribute('href'),
      text: a.innerText.trim(),
      hasValidTarget: a.getAttribute('href')?.startsWith('#') ? !!document.querySelector(a.getAttribute('href')) : true
    }));
  });

  await browser.close();

  const auditReport = {
    consoleLogs,
    pageErrors,
    desktopOverflow,
    mobileOverflow,
    linkAudit
  };

  fs.writeFileSync(
    '/Users/siddharthsingh/.gemini/antigravity/brain/613aa3cc-148c-42e7-a671-9d6e57466296/scratch/audit_report.json',
    JSON.stringify(auditReport, null, 2)
  );

  console.log('AUDIT_COMPLETE_SUCCESS');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
