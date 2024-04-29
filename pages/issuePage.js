const { test,expect } = require('@playwright/test');
var dotenv = require('dotenv');
dotenv.config();
var config = require('../tests/002_issue_binder/issue.json')

let issuenum

class issuePage{
    constructor(page) {
      this.page = page
      this.newPage = page
      this.customer=page.getByText('asmAmerican Society for')
      this.issue_icon='.nav-link.issue'
      this.issuebtn=page.locator('a').filter({ hasText: 'Issues' })
      this.addissuebtn='.addNewIssueButton.btn-filled.btn.pull-right.btn-xs'
      this.issue_sec=page.locator('#addIssue.windowHeightCard')
      this.jname=page.locator('.addJobDiv #singleUpload #ajproject')
      this.volno='#volumeNo'
      this.issno='#issueNo'
      this.pubyr='#publicationYear'
      this.final_add=page.locator('#singleUpload').getByText('Add issue')
      this.issuecover='#home-tab'
      this.successfuladd=page.locator('.ui-pnotify-title')

    }

async click_customer(){
    await this.customer.click()
}
async expect_issueicon(){
    await this.page.waitForSelector(this.issue_icon)
    await this.page.waitForLoadState('load')
}
async click_issuebtn(){
    await this.issuebtn.click()
}
async add_issue(){
//click_addissuebtn
    await this.page.waitForSelector(this.addissuebtn)
    await this.page.locator(this.addissuebtn).click()

//expect_issuesec()
    await expect(this.issue_sec).toBeVisible()

//journelname()
    await this.jname.selectOption('msphere');

//volume_no()
    await this.page.type(this.volno, config.vol_no)

//issue_no()
    const randomThreeDigitNumber = Math.floor(Math.random() * 900) + 100;
    issuenum = randomThreeDigitNumber.toString()
    await this.page.fill(this.issno, issuenum)

//pub_year()
    await this.page.type(this.pubyr, config.pub_year)

//final_addissue()
    await this.final_add.click()
    await this.page.waitForTimeout(3000)
}

async expect_success_popup(){
    //await this.page.bringToFront()
    await this.page.screenshot({ path: 'tests/002_issue_binder/issue1.png' });
    await this.page.waitForSelector('.ui-pnotify-title')
    await expect(this.successfuladd).toBeVisible()
}
/*async finaladd_expect_issueinfo(){
    const page1Promise = await this.page.waitForEvent('popup');
    await this.page.waitForTimeout(5000);
    const page1 = await page1Promise
    await this.page1.waitForLoadState();
    await this.page1.waitForSelector('#issueCoverInfo');
    expect(this.page1.locator('#issueCoverInfo'))
    await page1.close();
    const [newPage]=await Promise.all([
        await this.final_add.click(),
    ])
    await this.page.waitForSelector(this.issuecover)
    //const bin_det=this.newPage.locator(this.issuecover)
    await expect(this.issuecover).toBeVisible()
}*/
}
module.exports = issuePage
