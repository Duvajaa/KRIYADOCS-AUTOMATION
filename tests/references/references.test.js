const { test, expect } = require('@playwright/test');
var config = require('./reference_testdata.json');
var dotenv = require('dotenv');
dotenv.config();

let page;

test.describe('References',async() => {

    test('KD-TC-5378: References Should be validated from pubmed/crossref after structure',async({ browser }) =>{
        const context = await browser.newContext({storageState: "user.json"});
        page = await context.newPage();
        
        await page.goto(config.article1)
        await page.waitForLoadState();
    
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
        // await page.waitForTimeout(10000)
        await page.locator('.jrnlRefHead.activeElement').   click();
        await page.waitForSelector('.kriyaMenuBtn[data-name="Insert"]');
        await page.locator('.kriyaMenuBtn[data-name="Insert"]').click()
        await page.locator('.kriyaMenuItem[data-name="InsertReference"]').click()
        await page.locator('#byDOI').click()
        await page.locator('.text-line.searchField').fill(config.testdoi)
        await page.locator('.btn.btn-medium.pull-right[data-message*="searchRef_new"][data-message*="crossref"]').click()
        await page.locator('.btn.btn-medium.orange.validateBtn.screen1show.screen2hide.screen3hide').click()
        await page.locator('.btn.btn-medium.blue.lighten-1.insertNewRef.screen3hide.screen2hide.screen1hide.insertshow').click()
        const Ddoiref = page.locator('.toast')
        const doiref = page.locator('.jrnlRefText[data-pmid="38552609"]')
        await expect(Ddoiref).toBeVisible()
        await expect(doiref).toHaveAttribute('data-doi',config.testdoi)

    })

    test('KD-TC-5381: User Should be able to insert a reference using pubmedid in editor',async() => {
        //apply house rules --> approve --> select insert and add reference
        //pubmedid
        await page.locator('.jrnlRefHead.activeElement').click();
        await page.locator('.kriyaMenuBtn[data-name="Insert"]').click()
        await page.locator('.kriyaMenuItem[data-name="InsertReference"]').click()
        await page.locator('#byPubMed').click()
        await page.locator('.text-line.searchField').fill('38538791')
        await page.locator('.btn.btn-medium.pull-right[data-message*="searchRef_new"][data-message*="crossref"]').click()
        await page.locator('.btn.btn-medium.orange.validateBtn.screen1show.screen2hide.screen3hide').click()
        await page.locator('.btn.btn-medium.blue.lighten-1.insertNewRef.screen3hide.screen2hide.screen1hide.insertshow').click()
        const Dpubmedref = page.locator('.toast')
        const pubmedref = page.locator('.jrnlRefText[data-pmid="38538791"]')
        await expect(Dpubmedref).toBeVisible()
        await expect(pubmedref).toHaveAttribute('data-pmid',config.testpmid)
    })


    test('KD-TC-5382: User Should be able to insert a reference using pasting a reference in editor', async() => {

        //apply house rules --> approve --> select insert and add reference
    //paste ref --> assertion(select parent class and sub class(surname)to have text) for eg - loc(#11f4a903-8d10-4143-8f6d-f2984bd6c607 .RefSurName).to have text('cha')
        await page.locator('.jrnlRefHead.activeElement').click();
        await page.locator('.kriyaMenuBtn[data-name="Insert"]').click()
        await page.locator('.kriyaMenuItem[data-name="InsertReference"]').click()    
        await page.locator('#byPasteRef').click()
        await page.locator('.text-line.searchField').fill(config.testref)
        await page.locator('.btn.btn-medium.pull-right[data-message*="searchRef_new"][data-message*="crossref"]').click()
        await page.locator('.btn.btn-medium.orange.validateBtn.screen1show.screen2hide.screen3hide').click()
        await page.locator('.btn.btn-medium.blue.lighten-1.insertNewRef.screen3hide.screen2hide.screen1hide.insertshow').click()
        const Dpasteref = page.locator('.toast')
        await expect(Dpasteref).toBeVisible()
        const pasteref = page.locator('p[data-id="R15"] .RefSurName:nth-child(1)')
        await expect(pasteref).toHaveText('Simon');
    })

//data-message="{'click':{'funcToCall': 'deleteBlockConfirmation', 'param': {'delFunc':'deleteFloatBlock'},'channel':'components','topic':'general'}}"
//.z-depth-2.manualSave[data-component="confirmation_edit"]


    test('KD-TC-5383: User Should be able to Delete a reference ', async() => {
        await page.locator('p[data-id="R15"]').click()
        await page.locator('.autoWidth.z-depth-2.bottom .btn.btn-hover:has-text("Delete")').click()
        await page.locator('.popupFoot.row .btn.btn-medium.btn-danger.pull-right').click()
        const del = page.locator('p[data-id="R15"]')
        await expect(del).toHaveAttribute('data-track',"del")
    })
    
    test('KD-TC-5384: User Should be able to Cite a reference ', async() => {
        await page.locator('p[data-id="R13"]').click()
        await page.locator('.autoWidth.z-depth-2.bottom .btn.btn-hover:has-text("CiteNow")').click()
        await page.locator('.btn.btn-hover.indirectCitation').click()
        const citation = page.locator('.jrnlBibRef.activeElement[data-match="10"]')
        await expect(citation).toBeVisible();
    })

    test('KD-TC-5385: Reference reorder should work for numbered refernce citation as expected', async() => {
        await page.locator('#R10').click()
        await page.locator('.autoWidth.z-depth-2.bottom .btn.btn-hover:has-text("CiteNow")').click()
        await page.locator('.btn.btn-hover.indirectCitation').click()
        const reorderdialog = page.locator('#toast-container')
        await expect(reorderdialog).toBeVisible()
        await page.locator('.col.s12 .btn.btn-success.btn-medium.pull-right').click()
        const citevis = page.locator('.jrnlBibRef[data-init-id="R13"]')
        await expect(citevis).toBeVisible()
        await expect(citevis).toHaveAttribute('data-init-id',"R13")

    })

})