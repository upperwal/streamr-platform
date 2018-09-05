require('../env')

const express = require('./express')
const ganache = require('./ganache')

express.isNotRunning()
    .then((isNotRunning) => {
        if (isNotRunning) {
            express.start()
        } else {
            console.info('Dev server seems to be already running, skipping initialization.')
        }
    })

ganache.isNotRunning()
    .then((isNotRunning) => {
        if (isNotRunning) {
            ganache.start()
        } else {
            console.info('Ganache server seems to be already running, skipping initialization.')
        }
    })
