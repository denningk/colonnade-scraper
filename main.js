require('dotenv').config();
const puppeteer = require('puppeteer');

const setUp = async () => {
    const browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {width: 1920, height: 1080},
        slowMo: 100
    });
    const page = await browser.newPage();

    return [browser, page];
}

const teardown = async (browser) => {
    await browser.close();
}

const login = async (page) => {
    await page.goto('https://colonnadeconnections.wlu.edu/');
    await page.type('#PC12224_txtUsername', process.env.USER_NAME);
    await page.type('#PC12224_txtPassword', process.env.PASSWORD);
    await page.click('#PC12224_btnLogin');
};

const main = async () => {
    const [browser, page] = await setUp();

    await login(page);

    await page.goto('https://colonnadeconnections.wlu.edu/directory/advanced-search');
    await page.waitForSelector('#PC13914_ctl00_64_0');

    await page.type('#PC13914_ctl00_59_0', '18');
    await page.select('#PC13914_ctl00_64_0', 'Sigma Nu');
    await page.click('#PC13914_ctl00_btnRefresh');
    await page.waitForSelector('#PC13914_ctl00_directoryOutputGridView_myGridView');
    
    const tableLinks = await page.$$eval('.DirectoryListingItem > a', els => els);


    await teardown(browser);
};


main();