const fs = require('fs')
const os = require('os')
const path = require('path')
const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')
const debugConfig = require('./debug.json')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

const isDebugging = () => process.env.NODE_ENV === 'debug'

const setup = async () => {
    const browser = await puppeteer.launch(isDebugging() ? debugConfig : {
        slowMo: 5000,
    })
    global.BROWSER = browser
    mkdirp.sync(DIR)
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}

module.exports = setup
