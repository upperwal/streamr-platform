describe('Example', () => {
    let page
    beforeAll(async () => {
        const browser = global.BROWSER
        page = await browser.newPage()
        await page.goto(process.env.MARKETPLACE_URL)
    })

    afterAll(async () => {
        await page.close()
    })

    it('title matches', async () => {
        const title = await page.title()
        expect(title).toEqual('Streamr Marketplace')
    })
})
