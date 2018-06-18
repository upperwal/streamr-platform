const fs = require('fs')
const os = require('os')
const path = require('path')
const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')
const server = require('./server/index')

require('dotenv').config({
    path:'./.env.e2e'
})
 
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
const setup = async () => {
    await server.isNotRunning()
        .then(async () => {
            await server.setup()
            await server.start()
        })
        .catch(() => {
            console.info("\nGanache server seems already be running, skipping initialization.\n")
        })

    const browser = await puppeteer.launch()
    global.BROWSER = browser
    mkdirp.sync(DIR)
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}

module.exports = setup
