const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();

let page;
let pageURL = process.env.siteName;

test.describe('Login', async()=>{
  test('KD-TC-5370: User should able to login kriyadocs with valid credentails', async({browser})=>{
    // const context = await browser.newContext();
    const context = await browser.newContext({storageState: "user.json"})
    page = await context.newPage();
    await page.goto(pageURL);
    const elem = page.locator('.customerTitleDiv')
    await expect(elem).toHaveText("Select a customer");
  })

  test('open article url', async()=>{
    await page.goto("https://staging.kriyadocs.com/proof_review?doi=bmjopen-2020-039586&customer=bmj&project=bmjopen&type=journal");
    // await page.pause();
  })

});