import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';
import { browser as launch } from './browser.mjs';
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.setDefaultTimeout(60000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => {
  if (m.type() === 'error') errors.push(m.text());
});
page.on('response', (r) => {
  if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
});
const click = (selector) => page.locator(selector).dispatchEvent('click');
try {
  await page.goto(process.env.TEST_URL || 'http://localhost:5173', {
    waitUntil: 'domcontentloaded',
  });
  await page.waitForFunction(() => window.__showroomReady, null, { timeout: 90000 });
  await page.waitForFunction(() => window.__showroomDiagnostics().audioReady >= 2);
  const initial = await page.evaluate(() => window.__showroomDiagnostics());
  assert(initial.triangles > 10000);
  console.log('PASS: 3D model renders; original-recording audio decoded.');
  mkdirSync('.artifacts', { recursive: true });
  await page.evaluate(() => (window.__pauseRender = true));
  await page.screenshot({ path: '.artifacts/desktop.png', timeout: 60000 });
  await page.evaluate(() => (window.__pauseRender = false));
  // Real user gesture, then Space must rev even while ignition retains keyboard focus.
  await page.locator('#ignition').click({ force: true });
  await page.waitForFunction(() => window.__showroomDiagnostics().engine);
  await page.keyboard.down('Space');
  await page.waitForFunction(() => window.__showroomDiagnostics().rpm > 7500, null, {
    timeout: 90000,
  });
  await page.keyboard.up('Space');
  await page.waitForFunction(() => window.__showroomDiagnostics().rpm < 1500, null, {
    timeout: 90000,
  });
  console.log('PASS: ignition, Space throttle, redline approach, release to idle.');
  await click('#mute');
  assert.equal(await page.locator('#mute').textContent(), 'SOUND OFF');
  await click('#mute');
  await click('[data-era="vision"]');
  await click('[data-env="rain"]');
  await click('#ghost');
  let d = await page.evaluate(() => window.__showroomDiagnostics());
  assert.equal(d.era, 'vision');
  assert.equal(d.environment, 'rain');
  assert.equal(d.ghost, true);
  await click('[data-env="light"]');
  await click('#ghost');
  assert(await page.locator('body').evaluate((e) => e.classList.contains('light-mode')));
  await click('#rotate');
  assert.equal(await page.locator('#rotate').getAttribute('aria-pressed'), 'true');
  await click('#rotate');
  for (let i = 0; i < 4; i++) {
    await click(`[data-camera="${i}"]`);
    assert(
      await page.locator(`[data-camera="${i}"]`).evaluate((e) => e.classList.contains('active')),
    );
  }
  await page.locator('.hotspot').first().dispatchEvent('click');
  assert(await page.locator('#hotspot-dialog').evaluate((e) => e.open));
  await page.keyboard.press('Escape');
  await click('#hotspots');
  assert.equal(await page.locator('#hotspots').getAttribute('aria-pressed'), 'false');
  await click('#hotspots');
  await click('#specs-open');
  assert(await page.locator('#specs-dialog').evaluate((e) => e.open));
  await click('#silent');
  assert.equal((await page.evaluate(() => window.__showroomDiagnostics())).engine, false);
  await click('#story-open');
  assert(await page.locator('#story-dialog').evaluate((e) => e.open));
  await page.keyboard.press('Escape');
  console.log(
    'PASS: eras, three environments, ghost, rotation, four cameras, hotspots, drawers, mute, silent mode.',
  );
  await page.evaluate(() => (window.__pauseRender = true));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => window.__showroomReady, null, { timeout: 90000 });
  await page.waitForTimeout(1200);
  await page.evaluate(() => (window.__pauseRender = true));
  await page.screenshot({ path: '.artifacts/mobile.png', timeout: 60000 });
  assert(await page.evaluate(() => document.documentElement.scrollWidth === innerWidth));
  assert.deepEqual(errors, []);
  console.log(
    'PASS: responsive 390px layout, desktop/mobile captures, no JS errors or HTTP failures.',
  );
} finally {
  await browser.close();
}
