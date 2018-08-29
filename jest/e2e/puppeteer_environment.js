/* eslint-disable import/no-extraneous-dependencies */
require('./env')
const fs = require('fs')
const os = require('os')
const path = require('path')
const NodeEnvironment = require('jest-environment-node')
const puppeteer = require('puppeteer')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
class PuppeteerEnvironment extends NodeEnvironment {
    async setup() {
        await super.setup()
        // get the wsEndpoint
        const wsEndpoint = fs.readFileSync(path.join(DIR, 'wsEndpoint'), 'utf8')
        if (!wsEndpoint) {
            throw new Error('wsEndpoint not found')
        }

        // connect to puppeteer
        const browser = await puppeteer.connect({
            browserWSEndpoint: wsEndpoint,
        })
        this.global.BROWSER = await browser.createIncognitoBrowserContext()
    }

    async teardown() {
        await super.teardown()
    }

    runScript(script) {
        return super.runScript(script)
    }
}

module.exports = PuppeteerEnvironment
