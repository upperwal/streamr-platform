describe('User', () => {
    let page
    beforeAll(async () => {
        page = await global.BROWSER.newPage()
        await global.LOGIN(page, `${global.BASE_URL}/products/7a1d4e8cee6e41b0c304fd13d52f6434e39c7be5fd7ae158fc503b6ef71e4741`)
        await page.waitForSelector('#app')
    })

    afterAll(async () => {
        await page.close()
    })

    it('go to product edit', async () => {
        await page.click('.toolbar_buttons > a[href$="edit"]')
        expect(page.url()).toContain('/edit')
    })
})
