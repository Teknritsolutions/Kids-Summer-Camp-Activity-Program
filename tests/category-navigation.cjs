const {chromium}=require('playwright');const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch();const page=await browser.newPage();const base='http://127.0.0.1:4173/pages/programs.html';
await page.goto(base);
for(const category of ['Sports','Arts','Coding','Swimming','Nature']){
 await page.getByRole('navigation',{name:'Activity shortcuts'}).getByRole('link',{name:category,exact:true}).click();
 await page.waitForURL('**category='+category+'#program-count');
 assert.equal(await page.locator('#program-filters select[name=category]').inputValue(),category);
 assert.equal(await page.locator('#program-results .program-card').count(),1);
 assert.equal(await page.locator('.filter-tabs [aria-current=page]').innerText(),category);
 await page.reload();assert.equal(await page.locator('#program-results .program-card').count(),1);
}
await page.getByRole('navigation',{name:'Activity shortcuts'}).getByRole('link',{name:'All',exact:true}).click();
await page.waitForURL('**/programs.html#program-count');assert.equal(await page.locator('#program-results .program-card').count(),5);
await page.goBack();assert.equal(await page.locator('#program-filters select[name=category]').inputValue(),'Nature');
await page.getByRole('button',{name:'Reset',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.program-card').length===5);assert(!new URL(page.url()).searchParams.has('category'));
console.log('All six category links navigate correctly; filtering, reload, browser Back and reset passed.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
