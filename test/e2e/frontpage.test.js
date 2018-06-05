describe('Frontpage', () => {
    let page
    beforeAll(async () => {
        page = await global.BROWSER.newPage()
        await page.goto(global.BASE_URL)
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
        if (!productElement) {
            await page.screenshot({
                path: './productPageError.png',
            })
        }
        await Promise.all([
            productElement.click(),
            page.waitForNavigation(),
        ])
        expect(page.url()).toContain('/products/')
    })
})
