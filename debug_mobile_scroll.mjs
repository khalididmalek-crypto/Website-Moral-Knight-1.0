import { chromium, devices } from 'playwright';

async function run() {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext(devices['iPhone 12']);
    const page = await context.newPage();

    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`));

    console.log("Navigating to http://localhost:3000...");
    await page.goto("http://localhost:3000", { waitUntil: 'networkidle' });
    
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log("Looking for Contact tile...");
    const contactTile = page.getByText("Contact", { exact: true });
    
    if (await contactTile.isVisible()) {
        console.log("Clicking Contact tile...");
        await contactTile.click();
        
        console.log("Waiting for scroll sequence to complete (6 seconds)...");
        await new Promise(resolve => setTimeout(resolve, 6000));
        
        const scrollY = await page.evaluate(() => {
            const container = document.querySelector('div.overflow-y-auto');
            return container ? container.scrollTop : -1;
        });
        console.log(`Final scroll position: ${scrollY}`);
        
        await page.screenshot({ path: "mobile_contact_scroll.png" });
        console.log("Screenshot saved to mobile_contact_scroll.png");
    } else {
        console.log("Contact tile not found!");
        await page.screenshot({ path: "debug_not_found.png" });
    }

    await browser.close();
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
