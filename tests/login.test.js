var config = require('./login.json');
const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();

let page;
let pageURL = process.env.siteName;

test.describe('Login', async()=>{
  test('KD-TC-5370: User should able to login kriyadocs with valid credentails', async ({ browser }) => {
    const context = await browser.newContext();
    page = await context.newPage();
    //log in credentials from .env file
    await page.goto(pageURL + '/dashboard');
    await page.type('#username', process.env.kusername);
    await page.type('#password', process.env.password);
    await page.click('.input-field.login'); //clicking login button
    // either we get the confirmation panel to confirm or we get to see the new dashboard with customer cards
    // wait till we get to see one of these
    await page.waitForSelector('//span[text() = "BMJ"]|//div[@class="col s6 confirmationPanel"]', { state: 'visible' });
    // if the page url is not the same, then we are waiting for confirmation
    if (pageURL != page.url()) {
        await page.click('.confirm');
    }
    // wait for the customer cards to load, i.e., "".card"
    await page.waitForSelector('#customerSelectionDiv .customerTitle .customerTitleDiv', { state: 'visible' });
  });

  test('KD-TC-5371: User login kriyadocs with invalid credentails should show error', async({page})=>{
    // const page = await webContext.newPage();
    await page.goto(pageURL+ "/logout");
    await page.goto(pageURL);
    await page.type('#username', process.env.kusername);
    await page.type('#password', "Happy_Authors");
    await page.click('.input-field.login');
    const errTxt = page.locator('div[class="input-field col s12 login center loginButton"] span[class="error-text"]');
    await expect(errTxt).toHaveText(" Invalid credentials");
  })

  test('KD-TC-5372: Forget password should send a reset link in email to users with valid email id', async({page})=>{
    await page.goto(pageURL);
    await page.click(".row.login-view.forgetpassword.forgetPass a");
    await page.fill("#username", "abishek_automation@kriyadocs.com");
    await page.click('div[class="input-field sentForgetLink col s6 center"] a');
    const passsentnfy = page.locator("#forgetMessage");
    await expect(passsentnfy).toHaveText(" Link sent to your respective email id ");
  })

  test('KD-TC-5373: User should not allowed to login with empty username and password field', async({page})=>{
    await page.goto(pageURL);
    await page.click('div[class="input-field col s12 login center loginButton"] a[class="btn waves-effect waves-light col s12"]')
    const usrnameerr = page.locator("#username")
    const passerr = page.locator("#password")
    await expect(usrnameerr, passerr).toHaveAttribute('class', 'validate formfields invalid')
  })
});