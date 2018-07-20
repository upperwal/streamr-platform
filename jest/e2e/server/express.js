/* eslint-disable import/no-extraneous-dependencies */
const path = require('path')
const express = require('express')
const { isPortAvailable } = require('./utils')

const app = express()
const dist = path.resolve('dist')
app.use('/', express.static(dist))
app.get('*', (req, res) => res.sendFile(path.resolve(dist, 'index.html')))

const { PORT } = process.env

let server
module.exports = {
    isNotRunning: async () => isPortAvailable(PORT),
    start: () => {
        server = app.listen(PORT, () => console.info(`\n e2e -file host server running on ${server.address().port}!`))
    },
    stop: () => {
        server.close()
    },
}
