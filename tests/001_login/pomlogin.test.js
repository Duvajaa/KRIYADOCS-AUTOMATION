const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();
const LoginPage = require('../.././pages/loginPage.js');


let page;

test.describe('Login', () => {
    test('POM test', async ({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto(process.env.siteName+"/logout");
        await page.goto(process.env.siteName);
        const lp = new LoginPage(page);
        await lp.enterUsername();
        await lp.enterPassword();
        await lp.clickLoginBtn();
    })
});