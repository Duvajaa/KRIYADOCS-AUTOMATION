const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();

let page

test.describe('reports',async() => {
    test('KD-TC-5408:User should be able to view the article summary report with a date range',async({ browser }) => {
        const context = await browser.newContext({storageState: "user.json"});
        page = await context.newPage(); 
        await page.goto(process.env.siteName);
        await page.waitForSelector('.card .cusTitle[data-customer-name="bmj"]');
        await page.click('.card .cusTitle[data-customer-name="bmj"]');
        //await page.waitForSelector('.nav-item .nav-link.reports.nav_list1.active')
        // await page.waitForLoadState();
        await page.waitForSelector('.nav-link.reports.nav_list1');
        await page.locator('.nav-link.reports.nav_list1').click();
        await page.waitForSelector('.card-widget.row[data-report="All Article summary"]');
        await page.click('.card-widget.row[data-report="All Article summary"]');
        const report = page.locator('#dailyReportDiv');
        await expect(report).not.toBeEmpty();
        const Fdate = page.locator('#fromDate');
        await expect(Fdate).toBeVisible();
        const Tdate = page.locator('#toDate');
        await expect(Tdate).toBeVisible();

        // await page.click('.datepicker--content .datepicker--cell.datepicker--cell-day.-weekend-.-selected-[data-date="6"]');
        // await page.click('.datepicker--content .datepicker--cell.datepicker--cell-day.-weekend-.-selected-[data-date="7"]');
        // await expect(report).toBeEmpty();
        //.datepicker.-bottom-left-.-from-bottom-.active        

    })

    test('KD-TC-5409:User should be able to export the reports to csv and excel format',async() => {
        // await page.click('.card-widget.row[data-report="All Article summary"]');
        await page.click('#dropdownMenuButton');
        
        // Start waiting for download before clicking. Note no await.
        const downloadPromise1 = page.waitForEvent('download');
        await page.locator('.dropdown-item[onclick="eventHandler.components.actionitems.exportExcel(this,event)"]').click();
        const download1 = await downloadPromise1;

        // Wait for the download process to complete and save the downloaded file somewhere.
        await download1.saveAs("./tests/reports" + download1.suggestedFilename());
        await page.wai
        await page.click('#dropdownMenuButton');
        // Start waiting for download before clicking. Note no await.
        const downloadPromise2 = page.waitForEvent('download');
        await page.locator('.dropdown-item[onclick="eventHandler.components.actionitems.exportCSV(this,event)"]').click();
        const download2 = await downloadPromise2;
        
        // Wait for the download process to complete and save the downloaded file somewhere.
        await download2.saveAs("./tests/reports" + download2.suggestedFilename());
    })

})
   
