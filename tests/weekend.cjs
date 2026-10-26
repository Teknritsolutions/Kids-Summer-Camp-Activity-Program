const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch();
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 await page.goto('http://127.0.0.1:4173/pages/home-2.html');
 const cards=page.locator('.weekend-photo-card');
 assert.equal(await cards.count(),3);
 await cards.locator('img').evaluateAll(nodes=>Promise.all(nodes.map(n=>{n.loading='eager';return n.decode();})));
 for(let i=0;i<3;i++){
  const card=cards.nth(i),content=card.locator('.weekend-photo-card__content');
  await card.scrollIntoViewIfNeeded();
  await page.mouse.move(0,0);await page.waitForTimeout(350);
  assert.equal(await content.evaluate(n=>getComputedStyle(n).opacity),'0');
  await card.hover();await page.waitForTimeout(350);
  assert.equal(await content.evaluate(n=>getComputedStyle(n).opacity),'1');
  await page.mouse.move(0,0);await card.focus();await page.waitForTimeout(350);
  assert.equal(await content.evaluate(n=>getComputedStyle(n).opacity),'1');
  await card.evaluate(n=>n.blur());
 }
 await cards.first().hover();await page.waitForTimeout(400);
 await cards.first().locator('..').screenshot({path:'tests/screenshots/weekend-hover-photos.png'});
 const mobile=await browser.newPage({viewport:{width:390,height:900},isMobile:true,hasTouch:true});
 await mobile.goto('http://127.0.0.1:4173/pages/home-2.html');
 for(const card of await mobile.locator('.weekend-photo-card').all()){
  assert.equal(await card.locator('.weekend-photo-card__content').evaluate(n=>getComputedStyle(n).opacity),'1');
 }
 assert(await mobile.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
 await mobile.locator('.weekend-photo-card').first().screenshot({path:'tests/screenshots/weekend-touch-photo.png'});
 console.log('Three new images loaded; hover, keyboard focus, and touch text visibility passed.');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
