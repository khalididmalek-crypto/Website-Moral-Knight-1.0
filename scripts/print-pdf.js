const puppeteer = require('puppeteer');
const path = require('path');
const os = require('os');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    // Set to print media type
    await page.emulateMediaType('print');
    
    // Go to the page
    console.log("Navigating to http://localhost:3000/precheck ...");
    await page.goto('http://localhost:3000/precheck', { 
        waitUntil: 'networkidle2',
        timeout: 60000 
    });
    
    // Wait for markdown/fonts to possibly load
    await new Promise(r => setTimeout(r, 2000));

    const desktopPath = path.join(os.homedir(), 'Desktop', 'MK_Pre_check_AI_Orientatie.pdf');
    const localPath = path.join(process.cwd(), 'MK_Pre_check_AI_Orientatie_LOKAAL.pdf');
    
    console.log(`Saving PDF to: ${desktopPath}`);
    console.log(`Saving local copy to: ${localPath}`);
    
    await page.pdf({
        path: desktopPath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false,
        margin: { top: '0', right: '0', bottom: '0', left: '0' } 
    });

    await page.pdf({
        path: localPath,
        format: 'A4',
        printBackground: true,
        displayHeaderFooter: false,
        margin: { top: '0', right: '0', bottom: '0', left: '0' } 
    });

    console.log("Done!");
    await browser.close();
})();
