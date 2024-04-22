const { test, expect } = require('@playwright/test');
var commonData=require('./../../commonfunctionality') 
var config = require('./reference_testdata.json');
var dotenv = require('dotenv');
var path = require('path')
dotenv.config();
var fs = require('fs')
var path = require('path')
var testName = 'editor_test'

let page;

test.describe('References',async() => {

    test('KD-TC-5378: References Should be validated from pubmed/crossref after structure content',async({ browser }) =>{
        const context = await browser.newContext({storageState: "user.json"});
        page = await context.newPage();
        //Upload manuscript
        var data = config.editor_test.articletotest
        for (var xmlFile = 0; xmlFile < data.length; xmlFile++) {
            var filePath = path.resolve("./tests/006_references/" + config[testName]["articletotest"][xmlFile]["doi"] + ".xml")
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
        await page.goto(config.article1)
        await page.waitForLoadState();

        await page.waitForSelector(".btn.pull-right.btn-small.action-btn.structureContent");
        await page.click(".btn.pull-right.btn-small.action-btn.structureContent");
        await page.click(".btn.btn-small.indigo.structure-content.lighten-2");
        await page.waitForSelector(".pre-loader-message");
        await page.waitForSelector(".pre-loader-message:has-text('Validating Reference through Biblio Service ...')");
        await page.waitForSelector(".pre-loader-message:has-text('please wait ...')");
        console.log("Structure content ran successfully !");
    
        await page.waitForSelector('.jrnlArtTitle[class-name="ArtTitle"]');
        const Artitle = page.locator('.jrnlArtTitle[class-name="ArtTitle"]');
        await expect(Artitle).toBeVisible()

        await page.waitForSelector('#R2')
        const validated = page.locator('#R2');
        await page.waitForTimeout(2000)
        await expect(validated).toHaveAttribute('data-validated','true')
    })

    test('KD-TC-5379: Untagged references should be highlighted in red coloured after structure',async() =>{
        
        await page.waitForSelector('#contentDivNode #R17');
        const unvalidated = page.locator('#contentDivNode #R17');
        await page.waitForTimeout(2000)
        await expect(unvalidated).toHaveAttribute('data-untag','true')
    })

    test('KD-TC-5380: User Should be able to insert a reference using DOI in editor',async() => {

        //apply house rules --> approve --> select insert and add reference
        //DOI
        await page.goto(config.article2);
        await page.waitForLoadState();
        await page.waitForSelector('#contentDivNode .front .jrnlHeaderInfo .jrnlTitle');
        await page.locator('#contentDivNode .front .jrnlHeaderInfo .jrnlTitle').click();
        await page.waitForSelector('.kriyaMenuBtn[data-name="Insert"]');
        await page.locator('.kriyaMenuBtn[data-name="Insert"]').click()
        await page.locator('.kriyaMenuItem[data-name="InsertReference"]').click()
        await page.getByText('By DOI').click()
        await page.locator('.text-line.searchField').fill(config.testdoi)
        await page.waitForTimeout(3000);
        await page.locator('.btn.btn-medium.pull-right[data-message*="searchRef_new"][data-message*="crossref"]').click()
        await page.waitForTimeout(2000);
        await page.locator('.btn.btn-medium.orange.validateBtn.screen1show.screen2hide.screen3hide').click()
        await page.locator('.btn.btn-medium.blue.lighten-1.insertNewRef.screen3hide.screen2hide.screen1hide.insertshow').click()
        const Ddoiref = page.locator('.toast')
        const doiref = page.locator('[data-customer="bmj"] .jrnlRefGroup p:last-child')
        await expect(Ddoiref).toBeVisible()
        await expect(doiref).toHaveAttribute('data-doi',config.testdoi)

    })

    test('KD-TC-5381: User Should be able to insert a reference using pubmedid in editor',async() => {
        //apply house rules --> approve --> select insert and add reference
        //pubmedid
        await page.waitForSelector('#contentDivNode .front .jrnlHeaderInfo .jrnlTitle');
        await page.locator('#contentDivNode .front .jrnlHeaderInfo .jrnlTitle').click()
        await page.locator('.kriyaMenuBtn[data-name="Insert"]').click()
        await page.locator('.kriyaMenuItem[data-name="InsertReference"]').click()
        await page.getByText('By PubMed ID').click()
        await page.locator('.text-line.searchField').fill('38538791')
        await page.locator('.btn.btn-medium.pull-right[data-message*="searchRef_new"][data-message*="crossref"]').click()
        await page.locator('.btn.btn-medium.orange.validateBtn.screen1show.screen2hide.screen3hide').click()
        await page.locator('.btn.btn-medium.blue.lighten-1.insertNewRef.screen3hide.screen2hide.screen1hide.insertshow').click()
        const Dpubmedref = page.locator('.toast')
        const pubmedref = page.locator('[data-customer="bmj"] .jrnlRefGroup p:last-child')
        await expect(Dpubmedref).toBeVisible()
        await expect(pubmedref).toHaveAttribute('data-pmid',config.testpmid)
    })


    test('KD-TC-5382: User Should be able to insert a reference using pasting a reference in editor', async() => {

        //apply house rules --> approve --> select insert and add reference
    //paste ref --> assertion(select parent class and sub class(surname)to have text) for eg - loc(#11f4a903-8d10-4143-8f6d-f2984bd6c607 .RefSurName).to have text('cha')
    await page.waitForSelector('#contentDivNode .front .jrnlHeaderInfo .jrnlTitle');
    await page.locator('#contentDivNode .front .jrnlHeaderInfo .jrnlTitle').click()
        await page.locator('.kriyaMenuBtn[data-name="Insert"]').click()
        await page.locator('.kriyaMenuItem[data-name="InsertReference"]').click()    
        await page.getByText('Paste entire reference').click()
        await page.locator('.text-line.searchField').fill(config.testref)
        await page.locator('.btn.btn-medium.pull-right[data-message*="searchRef_new"][data-message*="crossref"]').click()
        await page.locator('.btn.btn-medium.orange.validateBtn.screen1show.screen2hide.screen3hide').click()
        await page.locator('.btn.btn-medium.blue.lighten-1.insertNewRef.screen3hide.screen2hide.screen1hide.insertshow').click()
        // const Dpasteref = page.locator('.toast')
        // await expect(Dpasteref).toBeVisible()
        const pasteref = page.locator('[data-customer="bmj"] .jrnlRefGroup p:last-child')
        await expect(pasteref).toContainText('Simon');
    })

//data-message="{'click':{'funcToCall': 'deleteBlockConfirmation', 'param': {'delFunc':'deleteFloatBlock'},'channel':'components','topic':'general'}}"
//.z-depth-2.manualSave[data-component="confirmation_edit"]


    test('KD-TC-5383: User Should be able to Delete a reference ', async() => {
        await page.locator('#contentDivNode p[data-id="R14"]').click()
        await page.waitForSelector('div[data-type="popUp"][data-component="jrnlRefText"]')
        await page.click('div[data-type="popUp"][data-component="jrnlRefText"] span:has-text("Delete")');
        await page.locator("span[class='btn btn-medium btn-success pull-right']").click();
        const del = page.locator('p.jrnlRefText[data-track="del"]')
        await expect(del).toHaveAttribute('data-track-detail',"The reference R14 was deleted.")
    })
    
    test('KD-TC-5384: User Should be able to Cite a reference ', async() => {
        await page.locator('#contentDivNode p[data-id="R13"]').click()
        await page.locator('#contentDivNode p[data-id="R13"]').click()
        await page.waitForSelector('div[data-type="popUp"][data-component="jrnlRefText"]')
        await page.click('div[data-type="popUp"][data-component="jrnlRefText"] span:has-text("Cite Now")');
        await page.waitForTimeout(1000);
        await page.locator('#contentContainer h1:has-text("Discussion") + p.jrnlSecPara').click()
        await page.click(".btn.btn-hover.indirectCitation");
        const citation = page.locator('span.jrnlBibRef[data-track="ins"][data-citation-string=" R13 "][data-cite-type="insert"]')
        await expect(citation).toBeVisible();
    })

    test('KD-TC-5385: Reference reorder should work for numbered refernce citation as expected', async() => {
        await page.waitForSelector(".kriya-notice.success .kriya-notice-header:has-text('please modify the order of the first citations in the text as needed')")
        await page.click(".kriya-notice-body span.btn.btn-success.btn-medium.pull-right");
        console.log("Reference reordered successfully !")
        const ref13 = page.locator('#contentDivNode p[data-id="R13"]');
        await expect(ref13).toContainText("Hayashi");

        // await page.locator('#contentDivNode p[data-id="R12"]').click()
        // await page.waitForSelector('div[data-type="popUp"][data-component="jrnlRefText"]')
        // await page.click('div[data-type="popUp"][data-component="jrnlRefText"] span:has-text("Cite Now")');
        // await page.waitForTimeout(1000);
        // await page.locator('#contentContainer h1:has-text("Discussion") + p.jrnlSecPara').click()
        // await page.click(".btn.btn-hover.indirectCitation");
        // const reorderdialog = page.locator('#toast-container')
        // await expect(reorderdialog).toBeVisible()
        // await page.locator('.col.s12 .btn.btn-success.btn-medium.pull-right').click()
        // const citevis = page.locator('.jrnlBibRef[data-init-id="R13"]')
        // await expect(citevis).toBeVisible()
        // await expect(citevis).toHaveAttribute('data-init-id',"R13")
    })

})