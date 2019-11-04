const puppeteer = require('puppeteer');

const main = async () => {
    const [browser, page] = await setUp();
    await page.goto('https://example.com');
    await page.screenshot({path: 'example.png'});

    await teardown(browser);
};

const setUp = async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    return [browser, page];
}

const teardown = async (browser) => {
    await browser.close();
}

main();