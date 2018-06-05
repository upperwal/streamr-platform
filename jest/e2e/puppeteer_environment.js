const fs = require('fs')
const os = require('os')
const path = require('path')
const NodeEnvironment = require('jest-environment-node')
const puppeteer = require('puppeteer')
require('dotenv').config({
    path: './.env.e2e',
})

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

class PuppeteerEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup()
        const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')
        if (!wsEndpoint) {
            throw new Error('wsEndpoint not found')
        }
        this.global.BROWSER = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint,
        })

        this.global.LOGIN = async (page, redirect) => {
            await page.goto(`http://localhost:8081/streamr-core/login/auth?redirect=${encodeURI(redirect)}`)
            await page.type('#username', 'tester1@streamr.com')
            await page.type('#password', 'tester1TESTER1')
            await Promise.all([
                page.click('#loginButton'),
                page.waitForNavigation(),
            ])
        }
        this.global.BASE_URL = process.env.BASE_URL
    }

    async teardown() {
        await super.teardown()
    }

    runScript(script) {
        return super.runScript(script)
    }
}

module.exports = PuppeteerEnvironment
