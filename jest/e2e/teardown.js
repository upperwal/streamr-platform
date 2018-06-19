const os = require('os')
const path = require('path')
const rimraf = require('rimraf')  // eslint-disable-line 
const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
const ganache = require('./server/ganache')
const express = require('./server/express')

const tearDown = async () => {
    await express.stop()
    await ganache.stop()
    await global.BROWSER.close()
    rimraf.sync(DIR)
}

module.exports = tearDown
