const{test,expect}=require('@playwright/test')

var dotenv = require('dotenv')
dotenv.config()

let page
let newPage
let pageURL = process.env.siteName
 
test.describe('Copyeditor flow',async() =>
{
    test(' KD-TC-5400: Copyeditor should receive a link to edit the article',async({browser}) =>{

            const context = await browser.newContext({storageState: "user.json"})
            page = await context.newPage()
            await page.goto(pageURL)
            await page.getByText('eLife Sciences Publications Ltd.').click()
            await page.goto('https://staging.kriyadocs.com/proof_review?doi=84173&customer=elife&project=elife&type=journal')
            
            //click approve button
            page.click('.btn.btn-small.action-btn[data-name="Approve"]')

            //error pop-up
            await page.waitForSelector('.input-field.col.s12.probeResultContainer')
            await page.click('.btn.btn-medium.blue.lighten-2.proceedingSignoff')

            //wait for the signoff pop-up
            await page.waitForSelector('.sign-off-row.sign-off-seperator')

            //click the required option
            await page.click('[name="signoff-radio"]')

            //click signoff button
            await page.click('.sign-off-options #signoffConform')

            //expect the signoff message
            const signoff=page.getByText('You have successfully signed off the article to the next stage.')
            await page.waitForSelector(signoff)
            console.log('signoff successful') 

            //back to dashboard
            await page.goto('https://staging.kriyadocs.com/dashboard')
            await page.getByText('eLife Sciences Publications Ltd.').click() 

            //search the doi 
            await page.waitForSelector('#searchBox.form-control.form-control-sm')
            await page.locator('#searchBox.form-control.form-control-sm').fill('84173')
            await page.waitForTimeout(3000)
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

            //expect the link 
            const link_ele=page.locator("(//a[@data-link-page='proof_review'])[1]")
            await expect(link_ele).toBeVisible()
            await expect(link_ele).toBeEnabled()
            console.log('link available')

            //get the href attribute
            const link=await link_ele.getAttribute('href')

            //create incognito 
            const incogo = await browser.newContext({ incognito: true });
            const newPage = await incogo.newPage()

            //goto the href
            await newPage.goto(link)
    
            //expect the article 
            await newPage.waitForSelector('#editorContainer')
            await expect(newPage.locator('#editorContainer')).toBeVisible()
            console.log('Your article is now ready') 
 })

    test(' KD-TC-5401: Copyeditor should be able to reply for open queries',async() => {

            //await newPage.goto('https://staging.kriyadocs.com/proof_review/?key=8e846e694f500fa895a00d74e40f091fc2a17eb93b9fe260554cd628f4bd2d0c9f6f2c0a71301947f0d37da984c95c59d223bcb7950fc0f7b67ca5da7e6299c41c2cd7f6adf0e37392da1881dbb29f9a761496dde402704c18d0ef9af09f854a258e392b5d42344b4d1df6db5800b13d5aee20d5daa3047fc065c5b1f2fc8b')
            
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
           await newPage.locator('.query-text-line.info.queryContent').type('aloha')
           await newPage.waitForTimeout(3000)

           //click add
           await newPage.locator('.btn.btn-medium.blue.lighten-2.add-query[data-name="query_add"]').click()
           }

           //verify the added query
           await newPage.waitForSelector('#openQueryDivNode .query-div.card.author.selected :text("aloha")')
           await expect(newPage.locator('#openQueryDivNode .query-div.card.author.selected :text("aloha")')).toBeVisible()
           console.log('query added!!')

    })

    test('KD-TC-5403: Copyeditor should be able to signoff the article',async() =>{

    //click approve button
    await newPage.locator('.btn.btn-small.action-btn[data-name="Approve"]').click()

    //expect the signoff pop-up
    await newPage.waitForSelector('.sign-off-row.sign-off-seperator')

    //select the option
    const signoff_option=await newPage.getByText(' I have reviewed the proof and want to send for copyediting check')
    await expect(signoff_option).toBeVisible()
    await newPage.click('xpath=//*[@id="compDivContent"]/div/div[84]/div/div[2]/div/div[3]/p[1]/input')

    //click signoff
    await newPage.click('.sign-off-options #signoffConform')

    //expect the signoff message
    await newPage.getByText('You have successfully signed off the article to the next stage.')
    console.log('signoff successful')
  })
  
})



