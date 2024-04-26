
const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();
const LoginPage = require('../.././pages/loginPage.js');

let page;

test.describe('Kriya_login', async() => {
    //to check invalid credentials
    test('KD-TC-5371: User Should be able to login with invalid credentials and show error',async({browser}) => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto(process.env.siteName+"/logout");
        await page.goto(process.env.siteName);
        const lp = new LoginPage(page); //object instantiate
        await lp.enterUsername(process.env.kusername);
        await lp.enterPassword("HappyAuthors");
        await lp.clickLoginBtn();
        const ertext = page.locator('.input-field.col.s12.login.center.loginButton .error-text');
        await expect(ertext).toHaveText(' Invalid credentials ');
    })
     
    //reset link is sent
    test('KD-TC-5372: forget password should send a reset link in email to user with valid email',async() => {
        const lp = new LoginPage(page); //object instantiate
        await page.goto(process.env.siteName);
        await page.waitForSelector('.row.login-view.forgetpassword.forgetPass a');
        await lp.clickForgetPassword();
        await page.locator('#login-page .col.s6.login-col-2').isVisible()
        await lp.enterUsername(process.env.kusername);
        //Note: This facility is not available for Exeter users
        // await page.click("div[class='input-field sentForgetLink col s6 center'] a[class='btn-small waves-effect waves-light col s12']");
        const reset = page.locator('#forgetMessage');
        await expect(reset).toHaveText(' Link sent to your respective email id ');
        await page.screenshot({ path: 'tests/001_login/forgetpassword.png' });
    })
    
    //empty username and password
    test('KD-TC-5373: User Should not be allowed to login with empty username and password ',async() => {
        const lp = new LoginPage(page); //object instantiate
        await page.goto(process.env.siteName);
        await lp.clickLoginBtn();
        const invuser = page.locator('#username.validate.formfields.invalid');
        const invpass = page.locator('#password.validate.formfields.invalid');
        await expect(invuser,invpass).toBeVisible();
    })

        //to check valid credentials
        test('KD-TC-5370: User Should be able to login with valid credentials',async() => {
            const lp = new LoginPage(page); //object instantiate
            await page.goto(process.env.siteName+"/logout");
            await page.goto(process.env.siteName);
            await lp.enterUsername(process.env.kusername);
            await lp.enterPassword(process.env.password);
            await lp.clickLoginBtn();
            await page.waitForTimeout(2000);
            if (await page.locator('.col.s6.confirmationPanel').isVisible())
            {
                await page.locator('.btn.waves-effect.waves-light.confirm').click();
            }
            await page.waitForSelector('#customerSelectionDiv .customerTitle .customerTitleDiv');
            await page.waitForTimeout(2000);
            await page.screenshot({ path: 'tests/001_login/login1.png' });
            await page.context().storageState({path: "user.json"})
            const dboard = page.locator('#customerSelectionDiv .customerTitle .customerTitleDiv');
            await expect(dboard).toBeVisible();
            await page.close();
        })
    
})
