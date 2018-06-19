const ganache = require('./ganache')
const express = require('./express')

ganache.setup()
ganache.start()
express.start()
