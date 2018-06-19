require('./env')
const fs = require('fs')
const os = require('os')
const path = require('path')
const puppeteer = require('puppeteer') // eslint-disable-line 
const mkdirp = require('mkdirp')
const ganache = require('./server/ganache')
const express = require('./server/express')

const { HEADLESS } = process.env

const DIR = path.join(os.tmpdir(), 'jest_puppeteer_global_setup')
const setup = async () => {
    await express.isNotRunning()
        .then(express.start)
        .catch(() => {
            console.info('\nDev server seems already be running, skipping initialization.\n')
        })
    await ganache.isNotRunning()
        .then(ganache.start)
        .catch(() => {
            console.info('\nGanache server seems already be running, skipping initialization.\n')
        })

    const browser = await puppeteer.launch({
        headless: HEADLESS !== 'false',
    })
    global.BROWSER = browser
    mkdirp.sync(DIR)
    fs.writeFileSync(path.join(DIR, 'wsEndpoint'), browser.wsEndpoint())
}

module.exports = setup
