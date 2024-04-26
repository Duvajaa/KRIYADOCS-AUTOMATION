const{test,expect}=require('@playwright/test')
var dotenv = require('dotenv')
dotenv.config()
var commonData=require('../../commonfunctionality') 
var config = require('./ce_flow.json')

var path = require('path')
var fs = require('fs')
var path = require('path')
var testName = 'editor_test'

let page
let newPage
let pageURL = process.env.siteName
 
test.describe('Copyeditor flow',async() =>
{
    test(' KD-TC-5400: Copyeditor should receive a link to edit the article',async({browser}) =>{

            const context = await browser.newContext({storageState: "user.json"})
            page = await context.newPage()
            var data = config.editor_test.articletotest
    for (var xmlFile = 0; xmlFile < data.length; xmlFile++) {
        var filePath = path.resolve("./tests/007_copyeditor_flow/" + config[testName]["articletotest"][xmlFile]["doi"] + ".xml")
        console.log(filePath)
        if (fs.existsSync(filePath)) {
            var responseData = await commonData.resetData(config, xmlFile, testName, filePath)
            expect(responseData.status).toEqual(200)
        }
        else {
            console.log(filePath + " No scuch file in the directory,Please check the xmlFile.")
        }
    }

            await page.goto(pageURL+config.article1)
            
            //click approve button
            await page.locator('.btn.btn-small.action-btn[data-name="Approve"]').click()
            await page.waitForSelector('.z-depth-2.bottom.manualSave[data-name="PROBE_VALIDATION_edit"]')

            await page.evaluate(() => {
              const elementToRemove = document.querySelector('.z-depth-2.bottom.manualSave[data-name="PROBE_VALIDATION_edit"]');
              if (elementToRemove) {
                elementToRemove.remove()
              }
            })

            //click approve button
            await page.locator('.btn.btn-small.action-btn[data-name="Approve"]').click()

            /*other kind of error pop-up
            await page.waitForSelector('.input-field.col.s12.probeResultContainer')
            await page.click('.btn.btn-medium.blue.lighten-2.proceedingSignoff')*/

            //wait for the signoff pop-up
            await page.waitForSelector('.sign-off-row.sign-off-seperator')

            //click the required option
            await page.click('[data-reviewer="copyediting"]')
            //await page.locator('.recipient').click()
            await page.locator('.recipient').selectOption('copyediting@kriyadocs.com')
            //await page.click('.recipient [value="copyediting@kriyadocs.com"]')


            //click signoff button
            await page.click('.sign-off-options #signoffConform')

            //expect the signoff message
            await page.waitForSelector('.messageDiv .message')
            console.log('signoff successful') 

            //back to dashboard
            await page.goto(pageURL+config.baseurl)
            await page.getByText('Microbiology Society').click() 

            //search the doi 
            await page.waitForSelector('#searchBox.form-control.form-control-sm')
            await page.locator('#searchBox.form-control.form-control-sm').fill(config.articleDOI)
            await page.waitForTimeout(5000)
            await page.click('.input-group-prepend .searchIcon')
    

            //click the article
            await page.waitForSelector('.articleFilteredCard.articleDetailed.articles.mt-1 .articleCard.row.section.article.searchData')
            await page.waitForTimeout(3000)
            await page.click('.articleFilteredCard.articleDetailed.articles.mt-1 .articleCard.row.section.article.searchData')

            //expect right side bar
            await expect(page.locator('.rightSideBar.sideBarTransition')).toBeVisible()
            await page.waitForTimeout(10000)

            //click history button
            await page.click('.nav-link.history')
            await page.waitForSelector("(//div[@class='stageDetails'])[1]")

            //click expand arrow
            await page.click("(//span[@class='expandHistory'])[1]")

            //expect and click article title
            await page.waitForSelector("(//div[@class='mail-subject'])[1]")
            //await expect(page.locator("(//div[@class='mail-subject'])[1]")).toBeVisible()
            await page.click("(//div[@class='mail-subject'])[1]")
            await page.screenshot({ path: 'tests/007_copyeditor_flow/ceflow1.png' });
            //expect the link 
            const link_ele=page.locator("//a[contains(text(),'​LINK')]")
            await expect(link_ele).toBeVisible()
            await expect(link_ele).toBeEnabled()
            console.log('link available')

            //get the href attribute
            const link=await link_ele.getAttribute('href')

            await page.close()

            //create incognito 
            const incogo = await browser.newContext({ incognito: true });
            newPage = await incogo.newPage()

            //goto the href
            await newPage.goto(link)
    
            //expect the article 
            await newPage.waitForSelector('#headerContainer')
            //await expect(newPage.locator('#editorContainer')).toBeVisible()
            console.log('Your article is now ready') 
 })

    test(' KD-TC-5401: Copyeditor should be able to reply for open queries',async() => {
            
            //click query button
            await newPage.click('.nav-action-icon.notes-icon')

            //expect the title opened query
            const open_query=await newPage.locator('.quriesTab .active')
            await expect(open_query).toBeVisible()

            //getting the first query
            await newPage.locator('query-div.card.publisher').locator('nth=0')

            //click the edit button on query
            await newPage.locator('.query-edit').locator('nth=0').click()
            
            //expect the textbox to be editable
            const query_textbox=await newPage.locator('.query-content').locator('nth=0')
            await expect(query_textbox).toBeEditable()

            //click save 
            await newPage.click('.btn.btn-medium.green.lighten-2.save-edit.green')
            console.log('able to reply!!!')
  })

    test(' KD-TC-5402: Copyeditor should be able to raise a new author query',async() =>{
           
           //select query person dropdown
           const option1="Author"
           const option2="Publisher"
           const option3="Typesetter"
           //const option4= newPage.locator('[value="Copyeditor"]')

           const options=[option1,option2,option3,]

           for(let i=0;i<options.length;i++)
           {
            // find the abstract part
           await newPage.waitForSelector('.jrnlAbsHead')
           await newPage.locator('.jrnlAbsPara').first().dblclick()
          
           //to click insert from menu
           await newPage.locator('.kriyaMenuBtn[data-name="Insert"]').click()

           //check and click insert query
           await newPage.locator('.kriyaMenuItems[data-name="InsertControls"]').isVisible()
           await newPage.locator('.kriyaMenuItem[data-name="insertQuery"]').click()

           //check popup is visible
           await newPage.locator('.hoverInline.z-depth-2.bottom[data-type="popUp"][data-name="QUERY"]').isVisible()
           
           const dropdown=await newPage.$('#queryPerson')
           await dropdown.click()
           await dropdown.type(options[i])
           await newPage.waitForTimeout(2000)  

           //enter query
           await newPage.locator('.query-text-line.info.queryContent').type('hurayyyy!!!')
           await newPage.waitForTimeout(3000)

           //click add
           await newPage.locator('.btn.btn-medium.blue.lighten-2.add-query[data-name="query_add"]').click()
           }

          /*verify the added query
           await newPage.waitForSelector('#openQueryDivNode .query-div.card.author.selected :text("aloha")')
           await expect(newPage.locator('#openQueryDivNode .query-div.card.author.selected :text("aloha")')).toBeVisible()*/
           console.log('query added!!')

    })

    test('KD-TC-5403: Copyeditor should be able to signoff the article',async() =>{

    //click approve button
    await newPage.locator('.btn.btn-small.action-btn[data-name="Approve"]').click()

    //expect the signoff pop-up
    await newPage.waitForSelector('.sign-off-row.sign-off-seperator')

    /*const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    console.log('Please select an option:')
    console.log('1. I have reviewed the proof and I am satisfied that all of my edits are complete.')
    console.log('2. Assign to level 3 copy editing.')

    rl.question('Enter your choice: ', async (choice) => {
      if (choice.trim() === '1') {
        await newPage.click('[data-reviewer="typesettercheck"]')
      }
      else if (choice.trim() === '2') {
        await newPage.click('[data-reviewer="publishercheck"]')
      }
      else {
        console.log('Invalid choice. Please choose either 1 or 2.')
      }
*/
      //select the option
      await newPage.click('[data-reviewer="typesettercheck"]')
      //const signoff_option=await newPage.getByText(' I have reviewed the proof and want to send for copyediting check')
      //await expect(signoff_option).toBeVisible()
      //await newPage.click('xpath=//*[@id="compDivContent"]/div/div[84]/div/div[2]/div/div[3]/p[1]/input')

      //click signoff
      await newPage.click('.sign-off-options #signoffConform')

      //expect the signoff message
      await newPage.waitForSelector('.messageDiv .message')
      await page.screenshot({ path: 'tests/007_copyeditor_flow/ceflow2.png' });
      console.log('signoff successful')
    })
})
  
//})



