const { test, expect } = require('@playwright/test');
const path = require('path'); // Import the path module
var dotenv = require('dotenv');
var config = require('./submission.json');
dotenv.config();

let page
let newPage
let context

test.describe('submission',async() => {
    test('KD-TC-5421: Login with invalid ORCID credentials',async({ browser }) => {
        const context = await browser.newContext();
        page = await context.newPage();
        await page.goto(config.site);
        const page1Promise = page.waitForEvent('popup');
        await page.click('.login-btn.orcid-login');
        await page.waitForTimeout(5000)
        const page1 = await page1Promise;
        //await page.click('.ot-sdk-row #onetrust-accept-btn-handler');
        await page1.waitForLoadState();
        await page1.locator('#username').fill(config.username);
        await page1.locator('#password').fill('ORCID72009434390');
        await page1.click('#signin-button')
        const ertxt = page1.locator('#mat-error-0')
        await expect(ertxt).toBeVisible();
        await page.bringToFront();
        await context.close();
        
    })
    
    test('KD-TC-5420: Login with valid ORCID credentials',async({browser}) => {
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto(config.site);
        const page2Promise = page.waitForEvent('popup');
        await page.click('.login-btn.orcid-login');
        await page.waitForTimeout(5000);
        const page2 = await page2Promise;
        //await page.click('.ot-sdk-row #onetrust-accept-btn-handler');
        await page2.waitForLoadState();
        await page2.locator('#username').fill(config.username);
        await page2.locator('#password').fill(config.password);
        await page2.click('#signin-button');
        await page.waitForSelector('.message .messageBody ');
        const logmsg = page.locator('.message .messageBody ');
        await expect(logmsg).toBeVisible();
        // await context.close();
    })
    
    test('KD-TC-5422: Check that user can save the entered data before submiting the data',async() => {
        await page.waitForTimeout(5000);
        //opening new tab
        const pagePromise = context.waitForEvent('page');
        await page.locator("//div[@class='message']//button[@aria-label='Go to submission'][normalize-space()='Go to submission']").click() 
        newPage = await pagePromise;
        await newPage.waitForLoadState();

    //     const [newPage]=await Promise.all([
    //         await page.locator("//div[@class='message']//button[@aria-label='Go to submission'][normalize-space()='Go to submission']").click(),
        
    // ]) 
    //Article details
        // await newPage.waitForLoadState()
        // await newPage.waitForTimeout(8000);
        // Locate the dropdown element
        await newPage.waitForSelector('.kriya-selectbox.dropdown-toggle[data-change-func="changeArticleType"]')
        await newPage.click('.kriya-selectbox.dropdown-toggle[data-change-func="changeArticleType"]') // Replace with the actual selector

        await newPage.waitForSelector('[data-config-variable="article-types"]'); // Optionally, wait for the dropdown menu to appear       
        await newPage.locator('.dropdown-item[data-value="Research Article"]').click(); // Select the desired option

        await newPage.waitForSelector('.kriya-selectbox.dropdown-toggle[data-save="sectionType"]')
        await newPage.click('.kriya-selectbox.dropdown-toggle[data-save="sectionType"]') // Locate the dropdown element
        
        await newPage.waitForSelector('.dropdown-menu.kriya-dropdown-menu.show'); // Optionally, wait for the dropdown menu to appear
        await newPage.click('.dropdown-item[data-value="Applied Geophysics"]'); // Select the desired option

        //await newPage.selectOption('.col-6.articleTypeGroup .kriya-dropdown-container', 'Research Article')
        
        await newPage.fill('#articleTitle',config.ArticleTitle);
        await newPage.fill('#summarynote',config.Abstract);
        await newPage.click('.col-12.keywordObjectGroup .keywordDiv.keywordObject.row.m-0.align-items-center'); //keywords
        await newPage.fill('.col-12.textField .input-field',config.keyword);
        await newPage.locator('#keywordModal .filled.button.btn[data-i18n="[text]messages.Save"]').click(); //save
        await newPage.click('.nextButton.button.filled.large.nextButtonGroup'); //next

//pre submission checkbox
        await newPage.click('.checkboxGroup .kriya-comp-label'); //checkbox
        await newPage.click('.nextButton.button.filled.large.nextButtonGroup'); //next

//Author details
        await newPage.locator('.col-6.emailGroup [data-savedata="email"]').fill(config.username); //email
        await newPage.click('.row.align-items-center.mb-2.affRow'); //add affliation
        await newPage.type('#jrnlInstitution',config.Instname); //add affliation
        await newPage.click('#ror-suggesstion-box'); //drop down
        await newPage.locator('#affiliationModal .filled.button.btn[data-i18n="[text]messages.Save"]').click();
        // await newPage.locator('.col-12.textField [data-class="institution-id"]').click();
        // await newPage.fill('[placeholder="Please provide your city"]',config.City);
        // await newPage.fill('[placeholder="Please provide your country"]',config.Country);
        await newPage.click('.col-12.addressData');//add config data
        await newPage.click('#correspAffiliationModal .affLabel.kriya-comp-label[data-i18n="[text]messages.Choose_existing"]');//existing locations
        await newPage.click('#chooseexistcorresp.tab-pane.active'); //selecting the address
        await newPage.locator('#correspAffiliationModal .filled.button.btn').click();
        await newPage.locator('.row.saveAuthorButtonGroup .button.btn-sm.saveauthorBtn.filled').click(); //save the dialog box
        await newPage.click('.nextButton.button.filled.large.nextButtonGroup'); // next button

//Declarations
        await newPage.fill('#daStatement',config.Statement);
        await newPage.fill('#fundingStatement',config.fundstate); 
        await newPage.click('.nextButton.button.filled.large.nextButtonGroup'); //next button

// //save for later
//         await newPage.click('.saveforlater.button.large'); //click save button
//         const savelater = page.locator('.message'); //verify click 
//         await expect(savelater).toBeVisible();

    })
    
    test('KD-TC-5423: check that user can upload the file',async() => {
        await newPage.click('.mandatory.displayFile'); //Add button
        //await newPage.click('.fileChooser');
        //input[type="file"]
        await newPage.waitForSelector('#fileUploadModal')
        const manuscriptFile = await newPage.locator('#fileUploadModal input[type="file"]');
        if(manuscriptFile){
            console.log("Element is present")
        } else {
            console.log("Element not present")
        }
        await manuscriptFile.setInputFiles(path.resolve(config.file)); //upload the file
        await newPage.click('.btn.button.filled.large.upload_button.save'); //click the upload button
        await newPage.waitForSelector('#animation-container', { state: 'hidden' });
        const file = newPage.locator(".col-5.fileLabel .mandatory.displayFile"); //verify attached or not
        await expect(file).toHaveText("Test_MS_AMA__1.docx");
        await newPage.click('.nextButton.button.filled.large.nextButtonGroup'); //next
    
    })
    

    test('KD-TC-5424: check that user can submit the manuscript',async() => {
       const file1 = newPage.locator(".documentList .docLink");; //manuscript there or not
       await expect(file1).toHaveText("Test_MS_AMA__1.docx");
       await newPage.click('.col-12 #submitPage'); //submit
       await newPage.click('.modal-footer #submitPage'); //agree and submit
    //    await newPage.waitForSelector(".messageDiv .message");
       const submit = newPage.locator('.messageDiv .message'); //dialog box
       await expect(submit).toHaveText("You have successfully submitted the article!");
    })

    // test('KD-TC-5425:check that user can able to access the save NewPage using same credential',async() => {

    // })
    
    
    
})