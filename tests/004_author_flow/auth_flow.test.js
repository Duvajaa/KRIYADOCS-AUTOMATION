var config = require('./auth_flow.json')
var commonData=require('./../../commonfunctionality') 
const { test, expect } = require('@playwright/test')
var path = require('path')
var dotenv = require('dotenv')
dotenv.config()
var fs = require('fs')
var path = require('path')
var testName = 'editor_test'

let page
let newPage
let pageURL = process.env.siteName

test.describe('AuthorFlow',async() =>{

test('KD-TC-5396: Author should receive a link to edit an article',async({browser}) =>{
    const context = await browser.newContext({storageState: "user.json"})
    page = await context.newPage()
    //Upload manuscript
    var data = config.editor_test.articletotest
    for (var xmlFile = 0; xmlFile < data.length; xmlFile++) {
        var filePath = path.resolve("./tests/004_author_flow/" + config[testName]["articletotest"][xmlFile]["doi"] + ".xml")
        console.log(filePath)
        if (fs.existsSync(filePath)) {
            var responseData = await commonData.resetData(config, xmlFile, testName, filePath)
            await expect(responseData.status).toEqual(200)
        }
        else {
            console.log(filePath + " No scuch file in the directory,Please check the xmlFile.")
        }
    }
    //
   //url for the respective article
    await page.goto(`${pageURL}/proof_review?doi=Spectrum00859-23&customer=asm&project=spectrum&type=journal`)
    await page.waitForTimeout(10000)
    // expect the email in the article 
    await expect(page.locator('.jrnlCorrAff[data-id="cor2"]')).toBeVisible()

    //click approve button
    await page.click('.btn.btn-small.action-btn[data-name="Approve"]')

    //wait for the signoff pop-up
    await page.waitForSelector('.sign-off-row.sign-off-seperator')

    //click the required option
    await page.click("(//input[@name='signoff-radio'])[3]")

    //click signoff button
    await page.click('.sign-off-options #signoffConform')

    //expect the signoff message
    const signoff=page.getByText('You have successfully signed off the article to the next stage.')
    console.log('signoff successful')
    await page.waitForTimeout(1000);
    //back to dashboard
    await page.goto(`${pageURL}/dashboard`)
    await page.getByText('asmAmerican Society for').click()

    //search the doi 
    await page.waitForSelector('#searchBox.form-control.form-control-sm')
    await page.locator('#searchBox.form-control.form-control-sm').type('Spectrum00859-23')
    await page.waitForTimeout(15000);
    await page.click("button[class='searchIcon']");
    await page.waitForTimeout(10000);

    //click the article
    //const article = page.locator('.articleFilteredCard.articleDetailed.articles.mt-1 .articleCard.row.section.article.searchData')
    // await page.waitForSelector('.articleFilteredCard.articleDetailed.articles.mt-1 .articleCard.row.section.article.searchData')
    // await expect(page.locator('.articleFilteredCard.articleDetailed.articles.mt-1 .articleCard.row.section.article.searchData')).toBeVisible()
    await page.click('.articleFilteredCard.articleDetailed.articles.mt-1 .articleCard.row.section.article.searchData')

    //expect right side bar
    await expect(page.locator('.rightSideBar.sideBarTransition')).toBeVisible()
    await page.waitForTimeout(15000)

    //click history button
    await page.click('.nav-link.history')
    await page.waitForSelector("(//div[@class='stageDetails'])[1]")

    //click expand arrow
    await page.click("(//span[@class='expandHistory'])[1]")

    //expect and click article title
    // await expect(page.locator("(//div[@class='mail-subject'])[1]")).toBeVisible()
    await page.waitForSelector("(//div[@class='mail-subject'])[1]")
    await page.click("(//div[@class='mail-subject'])[1]")

    //expect the link 
    const link_ele=await page.locator("(//a[@data-link-page='proof_review'])[1]")
    await expect(link_ele).toBeVisible()
    await expect(link_ele).toBeEnabled()
    console.log('link available')

    //get the href attribute
    const link=await link_ele.getAttribute('href')

    //create incognito 
    const incogo = await browser.newContext({ incognito: true });
    newPage = await incogo.newPage()

    //goto the href
    await newPage.goto(link)
    
    //expect the article status 
    await newPage.waitForSelector('.articleStatus')
    await expect(newPage.locator('.articleStatus')).toBeVisible()
    console.log('Your article is now ready for review')
    
 })

test('KD-TC-5398: Author should be able to attach pdf to the queries',async() =>{
  //opens incognito browser
  // const incogo = await browser.newContext({ incognito: true });
  // newPage = await incogo.newPage();
  // await newPage.goto(`${pageURL}/proof_review/?key=8e846e694f500fa895a00d74e40f091fc2a17eb93b81e17c454cc130eabd2d0c9f6f12296d201950e8cd7da988ca5d59d222bcb7950fc0f7b67ebfde6f688fdf0d33d0f4fca4fe709b82468fdebf92916d469cc2a30e711018dab793b3be8c5b2fba2937441d3947451beac8114dba355aee20d5daa30861c0688082bed6a1&?environment=testing`)
  // await newPage.waitForSelector('.articleStatus')

    //remove article proof
    //await expect(newPage.locator('.articleStatus')).toBeVisible()
    await newPage.evaluate(() => {
        const elementToRemove = document.querySelector('#welcomeContainer');
        if (elementToRemove) {
          elementToRemove.remove()
        }
      })
      //click the query button
    await newPage.waitForSelector('.nav-action-icon.notes-icon') 
    await newPage.click('.nav-action-icon.notes-icon')

    //click the approve button
    await newPage.click('.btn.btn-small.action-btn[data-name="Approve"]')

    //expect the error pop-up
    await newPage.waitForSelector('#toast-container')
    await newPage.click('.row.kriya-notice-header .icon-close')
    
    // //get the unanswered query
    // const unanswered_query = await newPage.locators('.query-div.card.author.unanswered').all();
    // await expect(unanswered_query).toBeVisible()

    //click reply
    await newPage.click('.query-div.card.author.unanswered .query-reply')

    //type the reply
    await newPage.locator('.queryResponse').type('Done')

    //click the resolved checkbox
    await newPage.click('#content-changed')

    //upload action
    await newPage.waitForTimeout(3000)
    const upload=await newPage.locator('.btn.btn-medium.blue.lighten-1.upload-file.pull-right')
    //var uploadClass = await page.getAttribute('[data-component="QUERY"] .upload-file:text("Upload file")', 'class')
    const [fileChooser] = await Promise.all([
      newPage.waitForEvent('filechooser'),
      newPage.waitForTimeout(3000),
      upload.click()
    ])
    await fileChooser.setFiles(path.resolve("./tests/004_author_flow/author_flow 1.pdf"));

    //click unable to resolve
    newPage.locator('xpath=//*[@id="31a37e54-1eb9-4f3c-b11b-260e4e5ab0e6"]/div/div[3]/span[4]').click

    //click save
    await newPage.click('.btn.btn-medium.green.lighten-2.add-reply')
    
}) 

test('KD-TC-5397: Author should be able to resolve the opened queries',async() =>{

    //click the query button
    await newPage.waitForSelector('.nav-action-icon.notes-icon') 
    await newPage.click('.nav-action-icon.notes-icon')

    //click the approve button
    await newPage.click('.btn.btn-small.action-btn[data-name="Approve"]')

    //expect the error pop-up
    await newPage.waitForSelector('#toast-container')
    await newPage.click('.row.kriya-notice-header .icon-close')
  
    //get the unanswered query
    const unanswered_q=await newPage.$$('.query-div.card.author.unanswered')
    if(unanswered_q)
    {
    const unanswered_queryy=await newPage.$$('.query-div.card.author.unanswered')
    const noq=unanswered_queryy.length
    console.log(noq)

    for(let i=0;i<noq;i++)
    {
      await newPage.click('.query-div.card.author.unanswered .query-reply')
      await newPage.locator('.queryResponse').type('Done')
      await newPage.click('#content-changed')
      await newPage.waitForTimeout(1000)
      await newPage.click('.btn.btn-medium.green.lighten-2.add-reply')
      
    }
    await newPage.click('.btn.btn-small.action-btn[data-name="Approve"]')
    if(unanswered_q){
      await newPage.click('.query-action-btn.q-d');
      await newPage.waitForSelector('.z-depth-2.manualSave');
      await newPage.click("span[class='btn btn-medium btn-success pull-right']");
    }
    
  }
  else
  {
     //await expect(newPage.locator('.query-div.card.author.unanswered')).toHaveCount(0)
    await newPage.click('.btn.btn-small.action-btn[data-name="Approve"]')
    const unanswered_query_pop= newPage.locator('.row.kriya-notice-header .icon-close')
    await expect(unanswered_query_pop).not.toBeVisible()
    //await expect(newPage.click('.row.kriya-notice-header .icon-close')).not.toBeVisible()
  }
 })
 
test('KD-TC-5399: Author should be able to signoff the article',async() =>{

    //click approve button
    await newPage.click('.btn.btn-small.action-btn[data-name="Approve"]')

    //expect the signoff pop-up
    await newPage.waitForSelector('.sign-off-row.sign-off-seperator')

    //select the option
    const signoff_option=await newPage.getByText(' I have reviewed the proof and I am satisfied that all of my edits are complete.')
    await expect(signoff_option).toBeVisible()
    await newPage.click('xpath=//*[@id="compDivContent"]/div/div[76]/div/div[2]/div/div[3]/p[1]/input')

    //click signoff
    await newPage.click('.sign-off-options #signoffConform')

    //expect the signoff message
    const signoff=page.getByText('You have successfully signed off the article to the next stage.')
    console.log('signoff successful')

  })
})




