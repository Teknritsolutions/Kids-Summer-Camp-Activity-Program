const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});
await page.goto('http://127.0.0.1:4173/pages/contact.html',{waitUntil:'domcontentloaded'});
assert.equal(await page.locator('img[src*="demo-map"]').count(),0);
assert(await page.locator('.hyderabad-location__map').getAttribute('src').then(s=>s.includes('Hyderabad')));
assert((await page.locator('.hyderabad-location address').innerText()).includes('500004'));
assert(!/For this template|Replace before|Your camp address here/.test(await page.locator('main').innerText()));
await page.locator('.hyderabad-location').scrollIntoViewIfNeeded();
await page.waitForTimeout(10000);
console.log('Map frames:',page.frames().map(f=>f.url()));
await page.locator('.hyderabad-location').screenshot({path:'tests/screenshots/hyderabad-map.png'});
await page.locator('.visit-planner').screenshot({path:'tests/screenshots/visit-planner.png'});
for(const width of [1440,1024,820,390,320]){await page.setViewportSize({width,height:1000});assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));}
await browser.close();console.log('Hyderabad map, reference address, visitor copy and responsive contact sections passed.');
})().catch(e=>{console.error(e);process.exit(1)});
