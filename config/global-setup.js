const { chromium, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();


let pageURL = process.env.siteName;

module.exports = async config => {
    const browser = await chromium.launch({headless: false});
    const page = await browser.newPage();
    console.log("global-setup started running ...")
    await page.goto(pageURL + '/dashboard');
    await page.type('#username', process.env.kusername);
    await page.type('#password', process.env.password);
    await page.click('.input-field.login'); //clicking login button
    // either we get the confirmation panel to confirm or we get to see the new dashboard with customer cards
    // wait till we get to see one of these
    await page.waitForSelector('//span[text() = "BMJ"]|//div[@class="col s6 confirmationPanel"]', { state: 'visible' });
    // if the page url is not the same, then we are waiting for confirmation
    if (pageURL + '/dashboard' != page.url()) {
        await page.click('.confirm');
    }
    // wait for the customer cards to load, i.e., "".card"
    await page.waitForSelector('#customerSelectionDiv .customerTitle .customerTitleDiv', { state: 'visible' });
    await page.context().storageState({path: "user.json"})
    await browser.close();
}
