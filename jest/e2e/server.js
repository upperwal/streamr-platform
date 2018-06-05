const path = require('path')
const express = require('express')

const app = express()

app.use(express.static(path.resolve('./dist')))
app.get('*', (req, res) => res.sendFile(path.resolve('./dist/index.html')))

app.listen(3333, () => console.log('Example app listening on port 3333!'))
