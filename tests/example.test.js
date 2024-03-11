var config = require('./login.json');
const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();

let webContext;
let pageURL = process.env.siteName + '/dashboard';

test.describe('Login', async()=>{
  test.beforeAll(async ({ browser }) => {
    try {
      const context = await browser.newContext();
      const page = await context.newPage();
      //log in credentials from .env file
      await page.goto(pageURL);
      await page.type('#username', process.env.kusername);
      await page.type('#password', process.env.password);

      await page.click('.input-field.login');
      // either we get the confirmation panel to confirm or we get to see the new dashboard with customer cards
      // wait till we get to see one of these
      await page.waitForSelector('//span[text() = "BMJ"]|//div[@class="col s6 confirmationPanel"]', { state: 'visible' });
      // if the page url is not the same, then we are waiting for confirmation
      if (pageURL != page.url()) {
          await page.click('.confirm');
      }
      // wait for the customer cards to load, i.e., "".card"
      await page.waitForSelector('#customerSelectionDiv .customerTitle .customerTitleDiv', { state: 'visible' });
      await context.storageState({path: 'login.json'});
      webContext = await browser.newContext({storageState: 'login.json'});
      await page.close();
  }
  catch (error) {
      console.log(error)
  }
  });

  test('KD-TC-5370: User should able to login kriyadocs with valid credentails', async()=>{
    const page = await webContext.newPage();
    await page.goto(pageURL);
    const elem = page.locator('.customerTitleDiv')
    await expect(elem).toHaveText("Select a customer");

  })
});