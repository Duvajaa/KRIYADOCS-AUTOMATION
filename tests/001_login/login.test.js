
const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();


let page;
test.describe('Kriya_login', async() => {
    
    //to check invalid credentials
    test('KD-TC-5371: User Should be able to login with invalid credentials and show error',async({browser}) => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto(process.env.siteName+"/logout");
        await page.goto(process.env.siteName);
        await page.locator('#username').fill(process.env.kusername);
        await page.locator('#password').fill('HappyAuthors');
        await page.locator('.input-field.col.s12.login.center.loginButton').click();
        const ertext = page.locator('.input-field.col.s12.login.center.loginButton .error-text');
        await expect(ertext).toHaveText(' Invalid credentials ');
    })
     
    //reset link is sent
    test('KD-TC-5372: forget password should send a reset link in email to user with valid email',async() => {
        await page.goto(process.env.siteName);
        if(await page.locator('.row.login-view.forgetpassword.forgetPass').click())
        {
            await page.locator('col s6 login-col-2').isVisible()
            await page.locator('#username').fill(process.env.kusername);
            const reset = page.locator('#forgetMessage');
            await expect(reset).toHaveText(' Link sent to your respective email id ');
        }
       
    })
    
    //empty username and password
    test('KD-TC-5373: User Should not be allowed to login with empty username and password ',async() => {
        await page.goto(process.env.siteName);
        await page.locator('.input-field.col.s12.login.center.loginButton').click();
        const invuser = page.locator('#username.validate.formfields.invalid');
        const invpass = page.locator('#password.validate.formfields.invalid');
        await expect(invuser,invpass).toBeVisible();
    })

        //to check valid credentials
        test('KD-TC-5370: User Should be able to login with valid credentials',async() => {
            await page.goto(process.env.siteName+"/logout");
            await page.goto(process.env.siteName);
            await page.locator('#username').fill(process.env.kusername);
            await page.locator('#password').fill(process.env.password);
            await page.locator('.input-field.col.s12.login.center.loginButton').click()
            await page.waitForTimeout(2000);
            if (await page.locator('.col.s6.confirmationPanel').isVisible())
            {
                await page.locator('.btn.waves-effect.waves-light.confirm').click();
            }
            await page.waitForSelector('#customerSelectionDiv .customerTitle .customerTitleDiv');
            await page.context().storageState({path: "user.json"})
            const dboard = page.locator('#customerSelectionDiv .customerTitle .customerTitleDiv');
            await expect(dboard).toBeVisible();
        })
    
})
