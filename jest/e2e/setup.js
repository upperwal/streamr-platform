require('./env')
const ganache = require('./server/ganache')
const express = require('./server/express')

const setup = async () => {
    await express.isNotRunning()
        .then((status) => {
            if (status) {
                express.start()
            } else {
                console.info('\nDev server seems already be running, skipping initialization.\n')
            }
        })
    await ganache.isNotRunning()
        .then((status) => {
            if (status) {
                ganache.start()
            } else {
                console.info('\nGanache server seems already be running, skipping initialization.\n')
            }
        })
}

module.exports = setup
