import { launchBrowser } from './mixins/common'

describe('Example', () => {
    let page
    beforeAll(async () => {
        const browser = await launchBrowser()
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
