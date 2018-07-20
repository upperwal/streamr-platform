import puppeteer from 'puppeteer'

const { HEADLESS } = process.env
const BROWSER_WIDTH = 1400
const BROWSER_HEIGHT = 1000

export const launchBrowser = async () => {
    const browser = await puppeteer.launch({
        headless: HEADLESS !== 'false',
        args: [
            `--window-size=${BROWSER_WIDTH},${BROWSER_HEIGHT}`,
        ],
    })
    const context = browser.createIncognitoBrowserContext()
    return context
}
