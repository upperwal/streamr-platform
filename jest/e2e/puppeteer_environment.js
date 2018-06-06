const fs = require('fs')
const os = require('os')
const path = require('path')
const NodeEnvironment = require('jest-environment-node')
const puppeteer = require('puppeteer')
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

require('dotenv').config({
    path: './.env.e2e',
})

const {
    BASE_URL,
    LOGOUT_URL,
    LOGIN_URL,
    LOGIN_USERNAME,
    LOGIN_PASSWORD,
} = process.env

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

        let loginPage = await this.global.BROWSER.newPage()
        this.global.LOGOUT = async () => loginPage.goto(LOGOUT_URL)
        this.global.LOGIN = async () => {
            await loginPage.goto(`${LOGIN_URL}?redirect=${encodeURI(BASE_URL)}`)
            await loginPage.type('#username', LOGIN_USERNAME)
            await loginPage.type('#password', LOGIN_PASSWORD)
            await Promise.all([
                loginPage.click('#loginButton'),
                loginPage.waitForNavigation(),
            ])
        }

        this.global.BASE_URL = BASE_URL
    }

    async teardown() {
        await super.teardown()
    }

    runScript(script) {
        return super.runScript(script)
    }
}

module.exports = PuppeteerEnvironment
