const os = require('os')
const path = require('path')
const rimraf = require('rimraf')
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
const server = require('./server/index')

const tearDown = async () => {
    await server.stop()
    await global.BROWSER.close()
    rimraf.sync(DIR)
}

module.exports = tearDown
