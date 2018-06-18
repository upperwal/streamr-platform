const faker = require('faker')

describe('Logged in user', () => {
    let page
    beforeAll(async () => global.LOGIN())
    afterAll(async () => global.LOGOUT())
    beforeEach(async () => { page = await global.BROWSER.newPage() })
    afterEach(async () => page.close())

    const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    const goToCreateProductPage = async () => {
        await page.goto(`${global.BASE_URL}/account/products/create`)
        await page.waitForSelector('#app')
    }

    const addNameAndDescription = async () => {
        await page.type('#name', faker.lorem.sentence())
        await page.type('#description', faker.lorem.sentence())
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
    const saveProduct = async (waitForImage = false) => {
        await page.click('.toolbar_buttons button:first-child')
        await page.waitForSelector('.productPage_productPage')
        if (waitForImage) {
            await page.waitForSelector('.productPage_productImage')
        }
    }

    const publishProduct = async () => {
        await page.waitForSelector('.toolbar_buttons')
        await page.click('.toolbar_buttons a:last-child')
        await page.waitForSelector('.readytopublish_confirm')
        await page.click('.readytopublish_confirm')
        await page.click('.dialog_buttons button:last-child')
        await page.waitForSelector('.checkmarkIcon_checkmark')
        await page.waitForSelector('.toolbar_buttons a.disabled:last-child')
        await page.keyboard.press('Escape')
        await page.waitForSelector('.toolbar_buttons a:last-child:not(.disabled)')
    }

    const addPrice = async () => {
        await page.click('.productDetailsEditor_editPrice')
        await page.waitForSelector('.setPriceDialog_dialog')
        await page.type('.amountEditor_editorContainer input[type="number"]', '2')
        await page.click('.setPriceDialog_dialog .buttons_buttons button:last-child')
        await page.click('.setPriceDialog_dialog .buttons_buttons button:last-child')
    }

    const purchaseProduct = async () => {
        await page.waitForSelector('.productDetails_button:not(.disabled)')
        await page.click('.productDetails_button')
        await page.click('.dialog_buttons button:last-child')
        await page.click('.dialog_buttons button:last-child')
        await timeout(1000)
        await page.click('.dialog_buttons button:last-child')
        await page.waitForSelector('.productDetails_activeTag')
    }

    it('Create a new free product', async () => {
        await goToCreateProductPage()
        await addNameAndDescription()
        await addPicture()
        await selectCategory()
        await selectStream()
        await saveProduct()
    })

    it('Create, publish and purchase a paid product', async () => {
        await goToCreateProductPage()
        await addNameAndDescription()
        await addPicture()
        await addPrice()
        await selectCategory()
        await selectStream()
        await saveProduct(true)
        await publishProduct()
        await purchaseProduct()
    })
})
