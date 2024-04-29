const { test, expect } = require('@playwright/test');
var config = require('./issue.json')
var dotenv = require('dotenv');
const { request } = require('http');
dotenv.config();
const issuePage=require('../../pages/issuePage')

let page
let pageURL = process.env.siteName

test.describe('issue_binder',async() =>{
    test('KD-TC-5410: User should be able to create a new issue',async({browser}) =>{

    const context = await browser.newContext({storageState: "user.json"})
    page = await context.newPage()
    await page.goto(pageURL+config.baseurl)

    //select customer
    let ip=new issuePage(page)
    await ip.click_customer()

    //wait for issue icon
    await ip.expect_issueicon()
   
    //click the issue button
    await ip.click_issuebtn()

    //add issue
    await ip.add_issue()

    //previous tab  
    await ip.expect_success_popup()
    
    })


 test('KD-TC-5411: User should be able to add articles into the section',async() =>{
        //issue binder page
        await page.goto(`https://staging.kriyadocs.com/binder?fileName=msphere_${config.vol_no}_${issuenum}&customer=asm&project=msphere&type=journal`)
        // await page.goto("https://staging.kriyadocs.com/binder?fileName=msphere_11_502&customer=asm&project=msphere&type=journal")
        await page.waitForLoadState();
        await page.waitForTimeout(10000);
        //click to add section
        await page.click('.btn-issue.btn.btn-xs.btn-filled.pull-right[data-original-title="Add Section"]')
        //expect the right side bar 
        await page.locator('.rightSideBar').isVisible()
        //click add card button on section
        await page.click('.pull-right.icon-content[data-original-title="Add Card"]')
        await page.waitForTimeout(10000)
        //drag and drp action to add article on the section
        await page.locator("(//div[@data-class='manuscript'])[1]").dragTo(page.locator("//div[contains(@class,'row issueSection')]"))
        //expect the article to be visible on the section bar
        await expect(page.locator('#New_section_1.sectionChildGroup.collapse.show')).toBeVisible()
    })

  test('KD-TC-5412: User should be able to export pdf',async() =>{
        await page.waitForTimeout(5000)
        //click the export all pdf button
        await page.click('.btn-issue.btn.btn-xs.btn-filled.pull-right.empty-issue-disable')
        //exporting pdf pop-up
        await expect(page.locator('.ui-pnotify-text')).toBeVisible()
        //click print only option
        await page.click('.custom-control-label[for="proofTypePrint"]')
        //click continue
        await page.click('.btn-filled.btn.btn-xs[style="margin-left:8px;"]')
        //exporting pop-up
        await page.waitForSelector('.ui-pnotify.export-pdf.ui-pnotify-fade-normal.ui-pnotify-mobile-able.ui-pnotify-in.ui-pnotify-fade-in.ui-pnotify-move');
        //click export pdf
        await page.waitForSelector("div[class='pdf-action-buttons'] span[name='cancel']");
        await page.getByText('Cancel').nth(2).click();

    })
    test('KD-TC-5413: User should be able to signoff the issues',async() =>{
        await page.waitForTimeout(4000)
        //click approve button
        await page.click('#approveBtn')
        //approve pop-up
        // await page.waitForTimeout(5000)
        await page.waitForSelector('#approvePanelDiv');
        await expect(page.locator('#approvePanelDiv')).toBeVisible()
        //approve option
        await expect(page.locator('.optionsPanel')).toBeVisible()
        //check the option
        await page.locator("(//input[@name='signoff-radio'])[1]").click()
        //click signoff button
        await page.click('.btn.btn-filled.sign-off-btn.pull-right')
        //final message
        // await page.waitForTimeout(30000)
        await page.waitForSelector("div[class='message']");
        const signoffelem = page.locator("div[class='message']");
        expect(signoffelem).toHaveText('You have successfully signed off the issue to the next stage. Please close the browser to exit the system.');
        
    })
})