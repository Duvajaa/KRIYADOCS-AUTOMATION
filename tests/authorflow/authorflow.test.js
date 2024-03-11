var config = require('./config.json');
const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();
var commonData = require('../../commonfunctionality');
var fs = require('fs')
var path = require('path');
var { dirname } = require('path');
var testName = 'editor_test';

let webContext;
let page;
let pageURL = process.env.siteName + '/dashboard';


test.beforeAll(async ({ browser }) => {
    var data = config.editor_test.articletotest
    for (var xmlFile = 0; xmlFile < data.length; xmlFile++) {
        var filePath = path.resolve("tests/authorflow/" + config[testName]["articletotest"][xmlFile]["doi"] + ".xml");
        console.log(filePath)
        if (fs.existsSync(filePath)) {
            var responseData = await commonData.resetData(config, xmlFile, testName, filePath)
            await expect(responseData.status).toEqual(200);
        }
        else {
            console.log(filePath + " No scuch file in the directory,Please check the xmlFile.");
        }
    }

    try {
        const context = await browser.newContext();
        page = await context.newPage();
        //log in credentials from .env file
        var pageURL = process.env.siteName + config.baseurl;
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

test('KD-TC-5370: User should able to login kriyadocs with valid credentails', async({page})=>{
page = await webContext.newPage();
await page.goto(pageURL);
const elem = page.locator('.customerTitleDiv')
await expect(elem).toHaveText("Select a customer");

})