describe('Frontpage', () => {
    let page
    beforeAll(async () => {
        page = await global.BROWSER.newPage()
        await page.goto('http://localhost:3333')
    })

    afterAll(async () => {
        await page.close()
    })

    it('title matches', async () => {
        const title = await page.title()
        expect(title).toEqual('Streamr Marketplace')
    })

    it('click a product to redirect to product -page', async () => {
        await Promise.all([
            page.click('.productTile_productTile > a'),
            page.waitForNavigation(),
        ])
        expect(page.url()).toContain('/products/')
    })
})
