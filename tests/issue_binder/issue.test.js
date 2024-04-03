const { test, expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();

let page
let pageURL = process.env.siteName
let issuenum

test.describe('issue_binder',async() =>{
    test('KD-TC-5410: User should be able to create a new issue',async({browser}) =>{
    const context = await browser.newContext({storageState: "user.json"})
    page = await context.newPage()
    await page.goto(pageURL)
    await page.getByText('asmAmerican Society for').click()
    //wait for issue icon
    await page.waitForSelector('.nav-link.issue')
    await page.waitForLoadState('load')
    //click the issue button
    await page.locator('a').filter({ hasText: 'Issues' }).click()
    //click add issue button
    await page.click('.addNewIssueButton.btn-filled.btn.pull-right.btn-xs')
    //expect add issue section
    const add_issue_pop = await page.locator('#addIssue.windowHeightCard')
    await expect(add_issue_pop).toBeVisible()
    //add volume.no
    await page.locator('#volumeNo').type(vol_no)
    //add issue.no
    const randomThreeDigitNumber = Math.floor(Math.random() * 900) + 100;
    issuenum = randomThreeDigitNumber.toString()
    await page.locator('#issueNo').fill(issuenum)
    //add pub_year
    await page.locator('#publicationYear').type(pub_no)

    //click add issue
    const [newPage]=await Promise.all([
        page.locator("(//span[contains(@class,'btn btn-filled')])[2]").click(),
        page.waitForTimeout(10000), 
    ])
    const bin_det=newPage.locator('#home-tab')
    await expect(bin_det).toBeVisible()
    //previous tab  
        page.bringToFront(),
    //successfully added pop-up
        expect(page.locator('.ui-pnotify-title')).toBeVisible()
    
    })

  test('KD-TC-5411: User should be able to add articles into the section',async() =>{
        //issue binder page
        await page.goto(`https://staging.kriyadocs.com/binder?fileName=msphere_11_${issuenum}&customer=asm&project=msphere&type=journal`)
        await page.waitForTimeout(10000)
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
        await expect(page.locator('.ui-pnotify.export-pdf.ui-pnotify-fade-normal.ui-pnotify-mobile-able.ui-pnotify-in.ui-pnotify-fade-in.ui-pnotify-move')).toBeVisible()
        //click export pdf
        await page.locator("(//span[contains(@class,'btn-filled btn')])[3]").click()

    })
    test('KD-TC-5413: User should be able to signoff the issues',async() =>{
        await page.waitForTimeout(5000)
        //click approve button
        await page.click('#approveBtn')
        //approve pop-up
        await page.waitForTimeout(5000)
        await expect(page.locator('#approvePanelDiv')).toBeVisible()
        //approve option
        await expect(page.locator('.optionsPanel')).toBeVisible()
        //check the option
        await page.locator("(//input[@name='signoff-radio'])[1]").click()
        //click signoff button
        await page.click('.btn.btn-filled.sign-off-btn.pull-right')
        
        //final message
        await page.waitForTimeout(30000)
        await expect(page.getByText('You have successfully signed off the issue to the next stage.')).toBeVisible()
        
        
    })
})