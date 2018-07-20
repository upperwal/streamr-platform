/* eslint-disable import/no-extraneous-dependencies */
require('./env')
const fs = require('fs')
const os = require('os')
const path = require('path')
const NodeEnvironment = require('jest-environment-node')
const puppeteer = require('puppeteer')

const {
    LOGOUT_PATH,
    LOGIN_PATH,
    LOGIN_USERNAME,
    LOGIN_PASSWORD,
    STREAMR_URL,
    MARKETPLACE_URL,
} = process.env

class PuppeteerEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup()

        const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
        const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')
        if (!wsEndpoint) {
            throw new Error('wsEndpoint not found')
        }
        this.global.BROWSER = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint,
            slowMo: 10,
        })

        const loginPage = await this.global.BROWSER.newPage()
        this.global.LOGOUT = async () => loginPage.goto(`${STREAMR_URL}/${LOGOUT_PATH}`)
        this.global.LOGIN =

        this.global.MARKETPLACE_URL = MARKETPLACE_URL
    }

    async teardown() {
        await super.teardown()
    }

    runScript(script) {
        return super.runScript(script)
    }
}

module.exports = PuppeteerEnvironment
