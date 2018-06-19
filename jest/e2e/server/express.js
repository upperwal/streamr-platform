const path = require('path')
const express = require('express')  // eslint-disable-line 
const { isPortAvailable } = require('./utils')

const app = express()
const dist = path.resolve('dist')
app.use('/', express.static(dist))
app.get('*', (req, res) => res.sendFile(path.resolve(dist, 'index.html')))

const port = 3333
let server

module.exports = {
    isNotRunning: async () => isPortAvailable(port),
    start: () => {
        server = app.listen(port, () => console.log('Example app listening on port 3000!'))
    },
    stop: () => {
        server.close()
    },
}
