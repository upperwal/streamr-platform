/* eslint-disable import/no-extraneous-dependencies */
const os = require('os')
const path = require('path')
const rimraf = require('rimraf')
const ganache = require('./server/ganache')
const express = require('./server/express')

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')

async function tearDown() {
    await express.stop()
    await ganache.stop()
    await this.BROWSER_GLOBAL.close()
    rimraf.sync(DIR)
}

module.exports = tearDown
