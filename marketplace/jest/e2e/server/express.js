/* eslint-disable import/no-extraneous-dependencies */
require('../env')
const path = require('path')
const express = require('express')
const { isPortAvailable } = require('./utils')

const app = express()
const dist = path.resolve('dist')

app.use(process.env.MARKETPLACE_BASE_URL, express.static(dist))
app.use((req, res) => res.sendFile(path.resolve(dist, 'index.html')))

const { PORT } = process.env

let server = {
    close: () => console.info('Server running independently or already shutdown'),
}
module.exports = {
    isNotRunning: async () => isPortAvailable(PORT),
    start: () => {
        server = app.listen(PORT, () => {
            console.info(`e2e -file host server running on ${server.address().port}!`)
        })
    },
    stop: () => {
        server.close()
    },
}
