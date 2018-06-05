describe('Frontpage', () => {
    let page
    beforeAll(async () => {
        page = await global.BROWSER.newPage()
        await page.goto(global.BASE_URL)
    })

    afterAll(async () => {
        await page.close()
    })

    it('title matches', async () => {
        const title = await page.title()
        expect(title).toEqual('Streamr Marketplace')
    })
})
