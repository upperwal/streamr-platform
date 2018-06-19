const path = require('path')
const express = require('express')  // eslint-disable-line 
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
        server = app.listen(PORT, () => console.log(`\n e2e -file host server running on ${server.address().port}!`))
    },
    stop: () => {
        server.close()
    },
}
