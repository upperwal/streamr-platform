describe('Frontpage', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3333')
    })

    it('title matches', async () => {
        const title = await page.title()

        await expect(title).toEqual('Streamr Marketplace')
    })
})
