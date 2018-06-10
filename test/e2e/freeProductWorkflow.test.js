const faker = require('faker')

describe('Logged in user', () => {
    let page
    beforeAll(async () => global.LOGIN())
    afterAll(async () => global.LOGOUT())
    beforeEach(async () => { page = await global.BROWSER.newPage() })
    afterEach(async () => page.close())

    const goToCreateProductPage = async () => {
        await page.goto(`${global.BASE_URL}/account/products/create`)
        await page.waitForSelector('#app')
    }

    const addNameAndDescription = async () => {
        await page.type('#name', faker.lorem.sentence())
        await page.type('#description', faker.lorem.paragraph())
    }

    const selectCategory = async () => {
        await page.click('.dropdown .dropdowns_textToggle')
        await page.click('.dropdown .dropdown-menu button')
    }
    const selectStream = async () => {
        await page.click('.streamSelector_editButton')
        await page.click('.streamSelector_streams button')
        await page.click('.streamSelector_footer button:last-child')
    }
    const addPicture = async () => {
        const fileInput = await page.$('.imageUpload_dropzone input[type="file"]')
        await fileInput.uploadFile('./assets/app_crashed.png')
    }
    const saveProduct = async () => {
        await page.click('.toolbar_buttons button:first-child')
        await page.waitForSelector('.productPage_productPage')
    }

    const publishProduct = async () => {
        await page.click('.toolbar_buttons a:last-child')
        await page.waitForSelector('.dialog_dialog')
        await page.click('.readytopublish_confirm')
        await page.click('.dialog_buttons button:last-child')
        await page.waitForSelector('.checkmarkIcon_checkmark')
        await page.keyboard.press('Escape')
    }

    const addPrice = async () => {
        await page.click('.ProductDetailsEditor_editPrice')
        await page.waitForSelector('.setPriceDialog_dialog')
        await page.type('.amountEditor_editorContainer input[type="number"]', '12')
        await page.click('.setPriceDialog_dialog .buttons_buttons button:last-child')
        await page.click('.setPriceDialog_dialog .buttons_buttons button:last-child')
    }
    /*
    it('Create a new product', async () => {
        await goToCreateProductPage()
        await addNameAndDescription()
        await addPicture()
        await selectCategory()
        await selectStream()
        await saveProduct()
    })
    */
    it('A paid product workflow', async () => {
        await goToCreateProductPage()
        await addNameAndDescription()
        await addPicture()
        await addPrice()
        await selectCategory()
        await selectStream()
        await saveProduct()
        await publishProduct()
    })
    /*
    it('Go to edit product', async () => {
        await page.goto(`${global.BASE_URL}/products/7a1d4e8cee6e41b0c304fd13d52f6434e39c7be5fd7ae158fc503b6ef71e4741`)
        await page.click('.toolbar_buttons > a[href$="edit"]')
        expect(page.url()).toContain('/edit')
    })
    */
})
