const { chromium } = require('playwright');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const errors = [];
  await context.route('**/Kids-Summer-Camp-Activity-Program/**', async route => {
    const url = route.request().url().replace('/Kids-Summer-Camp-Activity-Program/', '/');
    const response = await route.fetch({ url });
    await route.fulfill({ response });
  });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const prefix of ['/', '/Kids-Summer-Camp-Activity-Program/']) {
    const url = 'http://127.0.0.1:4173' + prefix;
    await page.goto(url, { waitUntil: 'networkidle' });
    assert.equal(page.url(), url);
    assert.equal(await page.locator('h1').count(), 1);
    assert.equal(await page.locator('meta[http-equiv=refresh]').count(), 0);
    await page.evaluate(() => Promise.all([...document.images].map(image => { image.loading = "eager"; return image.decode(); })));
    const icon = await page.locator('link[rel=icon]').first().getAttribute('href');
    const iconUrl = await page.evaluate(href => new URL(href, document.baseURI).href, icon);
    const iconResponse = await page.request.get(iconUrl.replace('/Kids-Summer-Camp-Activity-Program/', '/'));
    assert.equal(iconResponse.status(), 200);
    const iconBytes = await iconResponse.body();
    assert.equal(iconBytes.readUInt16LE(2), 1);
    assert.equal(iconBytes.readUInt16LE(4), 3);
    await page.locator('.adventure-hero__copy .btn-primary').click();
    await page.waitForURL('**/pages/programs.html');
    assert.equal(await page.locator('#program-results > article').count(), 11);
    await page.locator('.site-header .brand').click();
    await page.waitForURL('**/pages/index.html');
    for (const width of [1440, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    }
  }
  assert.deepEqual(errors, []);
  await browser.close();
  console.log('Passed direct homepage loading, project-subdirectory links, image decoding, ICO variants, and responsive layout.');
})().catch(error => { console.error(error); process.exit(1); });
