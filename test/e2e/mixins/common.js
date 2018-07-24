import puppeteer from 'puppeteer'

const { HEADLESS } = process.env

const browser = puppeteer.launch({
    headless: HEADLESS !== 'false',
    slowMo: 10,
})

export const launchBrowser = async () => browser.createIncognitoBrowserContext()
