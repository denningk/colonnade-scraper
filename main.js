require("dotenv").config();
const puppeteer = require("puppeteer");

const setUp = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1920, height: 1080 }
  });
  const page = await browser.newPage();

  return [browser, page];
};

const teardown = async browser => {
  await browser.close();
};

const login = async page => {
  await page.goto("https://colonnadeconnections.wlu.edu/");
  await page.type("#PC12224_txtUsername", process.env.USER_NAME);
  await page.type("#PC12224_txtPassword", process.env.PASSWORD);
  await page.click("#PC12224_btnLogin");
};

const getEmails = async (page, links) => {
  const contacts = [];

  for (const link of links) {
    await page.goto(link);
    await page.waitForSelector(".ejoDirectoryDisplay");
    let name, email, year;

    if (
      (await page.$(
        ".ejoDirectoryDisplay > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > span:nth-child(1)"
      )) !== null
    ) {
      name = await page.$eval(
        ".ejoDirectoryDisplay > tbody:nth-child(1) > tr:nth-child(2) > td:nth-child(2) > span:nth-child(1)",
        el => el.innerText
      );
    } else {
      name = null;
    }

    if (
      (await page.$(
        ".ejoDirectoryDisplay > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2) > span:nth-child(1) > a:nth-child(1)"
      )) !== null
    ) {
      email = await page.$eval(
        ".ejoDirectoryDisplay > tbody:nth-child(1) > tr:nth-child(8) > td:nth-child(2) > span:nth-child(1) > a:nth-child(1)",
        el => el.innerText
      );
    } else {
      email = null;
    }

    if (
      (await page.$(
        ".ejoDirectoryDisplay > tbody:nth-child(1) > tr:nth-child(17) > td:nth-child(2) > span:nth-child(2)"
      )) !== null
    ) {
      year = await page.$eval(
        ".ejoDirectoryDisplay > tbody:nth-child(1) > tr:nth-child(17) > td:nth-child(2) > span:nth-child(2)",
        el => el.innerText
      );
    } else {
      year = null;
    }
    contacts.push({ name: name, email: email, year: year });
  }
  return contacts;
};

const main = async () => {
  const [browser, page] = await setUp();

  await login(page);

  const years = [
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "60",
    "61",
    "62",
    "63",
    "64"
  ];

  let contacts = [];

  for (const year of years) {
    await page.goto(
      "https://colonnadeconnections.wlu.edu/directory/advanced-search"
    );
    await page.waitForSelector("#PC13914_ctl00_64_0");

    await page.type("#PC13914_ctl00_59_0", year);
    await page.select("#PC13914_ctl00_64_0", "Sigma Nu");
    await page.click("#PC13914_ctl00_btnRefresh");
    await page.waitForSelector(
      "#PC13914_ctl00_directoryOutputGridView_myGridView"
    );

    const tableLinks = await page.$$eval(".DirectoryListingItem > a", els =>
      els.map(el => el.getAttribute("onclick"))
    );

    const currContacts = await getEmails(page, tableLinks);
    contacts = contacts.concat(currContacts);
  }

  console.log(JSON.stringify(contacts));

  await teardown(browser);
};

main();
