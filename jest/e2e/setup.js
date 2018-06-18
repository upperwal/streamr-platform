const fs = require('fs')
const os = require('os')
const path = require('path')
const puppeteer = require('puppeteer')
const mkdirp = require('mkdirp')
const server = require('./server/index')
const nodePortCheck = require('node-port-check');

require('dotenv').config({
    path:'./.env.e2e'
})

const checkPortAvailability = (port) => new Promise((resolve, reject) => {
    nodePortCheck({ port, maxRetries: 0 }, (isPortAvailable) => isPortAvailable ? resolve(port) : reject(port))
})
 
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
const setup = async () => {
    await checkPortAvailability(process.env.BLOCK_CHAIN_PORT)
        .then(async () => {
            await server.setup()
            await server.start()
        })
        .catch(async () => {
            console.info("\nGanache server seems already be running, skipping initialization.\n")
        })
        
    const browser = await puppeteer.launch()
    global.BROWSER = browser
    mkdirp.sync(DIR)
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}

module.exports = setup
