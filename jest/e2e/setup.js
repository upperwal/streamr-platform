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
    express.isNotRunning()
        .then((isNotRunning) => {
            if (isNotRunning) {
                express.start()
            } else {
                console.info('\nDev server seems to be already running, skipping initialization.\n')
            }
        })
    ganache.isNotRunning()
        .then((isNotRunning) => {
            if (isNotRunning) {
                ganache.start()
            } else {
                console.info('\nGanache server seems already be running, skipping initialization.\n')
            }
        })
    const browser = await puppeteer.launch({
        headless: HEADLESS !== 'false',
        slowMo: 10,
        defaultViewport: {
            width: 1280,
            height: 720,
        },
    })
    global.BROWSER_GLOBAL = browser
    mkdirp.sync(DIR)
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}

module.exports = setup
