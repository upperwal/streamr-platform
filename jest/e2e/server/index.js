require('events').EventEmitter.defaultMaxListeners = 150;
require('dotenv').config({
    path:'./.env.e2e'
})

const { BLOCK_CHAIN_PORT } = process.env
const Web3 = require('web3')
const Ganache = require("ganache-core")
const config = require('./config.json')
const { deploy, getInitialProducts, startWatcherAndInformer } = require('./utils')

const server = Ganache.server(config)
const web3 = new Web3()

module.exports = {
    start: async (debug = false) => {
        await new Promise((resolve) =>
            server.listen(BLOCK_CHAIN_PORT, (err, blockchain) => {
                console.info(`Ganache server running on ${BLOCK_CHAIN_PORT}`)
                web3.setProvider(`ws://localhost:${BLOCK_CHAIN_PORT}`)
                getInitialProducts()
                    .then(deploy(web3, debug))
                    .then(startWatcherAndInformer(web3, debug))
                    .then(resolve)
                    .catch(console.debug)
        }))
    },
    stop: async () => {
        await server.close()
    }
}