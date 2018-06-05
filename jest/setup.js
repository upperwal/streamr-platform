const fs = require('fs')
const os = require('os')
const path = require('path')
const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

const setup = async () => {
    const browser = await puppeteer.launch({
        headless: false,
    })
    global.BROWSER = browser
    mkdirp.sync(DIR)
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}

module.exports = setup
