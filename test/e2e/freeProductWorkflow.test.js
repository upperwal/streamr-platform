const faker = require('faker')

describe('Logged in user', () => {
    let page
    beforeAll(async () => global.LOGIN())
    afterAll(async () => global.LOGOUT())
    beforeEach(async () => { page = await global.BROWSER.newPage() })
    afterEach(async () => page.close())

    it('Create a new product', async () => {
        await page.goto(`${global.BASE_URL}/account/products/create`)
        await page.waitForSelector('#app')
        await page.type('#name', faker.lorem.sentence())
        await page.type('#description', faker.lorem.paragraph())
        await page.click('.dropdown .dropdowns_textToggle')
        await page.click('.dropdown .dropdown-menu button')
        await page.click('.streamSelector_editButton')
        await page.click('.streamSelector_streams button')
        await page.click('.streamSelector_footer button:last-child')
        const fileInput = await page.$('.imageUpload_dropzone input[type="file"]')
        await fileInput.uploadFile('./assets/app_crashed.png')
        await page.click('.toolbar_buttons button:first-child')
        await page.waitForSelector('.productPage_productPage')
    })

    it('Go to edit product', async () => {
        await page.goto(`${global.BASE_URL}/products/7a1d4e8cee6e41b0c304fd13d52f6434e39c7be5fd7ae158fc503b6ef71e4741`)
        await page.click('.toolbar_buttons > a[href$="edit"]')
        expect(page.url()).toContain('/edit')
    })
})
