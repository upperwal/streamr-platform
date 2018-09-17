require('./env')
const fs = require('fs')
const os = require('os')
const path = require('path')
const mkdirp = require('mkdirp')
const puppeteer = require('puppeteer') // eslint-disable-line import/no-extraneous-dependencies
const ganache = require('./server/ganache')
const express = require('./server/express')

const { HEADLESS } = process.env

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
const setup = async () => {
    const promises = [
        express.isNotRunning()
            .then((isNotRunning) => {
                if (isNotRunning) {
                    express.start()
                } else {
                    console.info('Dev server seems to be already running, skipping initialization.')
                }
            }),
        ganache.isNotRunning()
            .then((isNotRunning) => {
                if (isNotRunning) {
                    ganache.start()
                } else {
                    console.info('Ganache server seems to be already running, skipping initialization.')
                }
            }),
    ]
    await Promise.all(promises)
    const browser = await puppeteer.launch({
        headless: HEADLESS !== 'false',
        slowMo: 10,
    })
    global.BROWSER_GLOBAL = browser
    mkdirp.sync(DIR)
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}

module.exports = setup
