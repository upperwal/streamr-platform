import { launchBrowser } from './mixins/common'

describe('Frontpage', () => {
    let page
    beforeAll(async () => {
        const browser = await launchBrowser()
        page = await browser.newPage()
        await page.goto(process.env.MARKETPLACE_URL)
        await page.waitForSelector('#app')
    })

    afterAll(async () => {
        await page.close()
    })

    it('title matches', async () => {
        const title = await page.title()
        expect(title).toEqual('Streamr Marketplace')
    })

    it('click a product to redirect to product -page', async () => {
        const productElement = await page.$('.productTile_productTile > a')
        await Promise.all([
            productElement.click(),
            page.waitForNavigation(),
        ])
        expect(page.url()).toContain('/products/')
    })
})
