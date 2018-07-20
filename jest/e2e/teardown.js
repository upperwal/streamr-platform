/* eslint-disable import/no-extraneous-dependencies */
const ganache = require('./server/ganache')
const express = require('./server/express')

const tearDown = async () => {
    await express.stop()
    await ganache.stop()
}

module.exports = tearDown
