const Web3 = require('web3')
const Ganache = require("ganache-core")
const { deploy, getInitialProducts, startWatcherAndInformer, setupEnvironment, challenge } = require('./utils')

const server = Ganache.server(
    require('./config.json')
)

module.exports = {
    setup: async () => {
        setupEnvironment()
        challenge()
    },
    start: async (debug = false) => {
        const { BLOCK_CHAIN_PORT } = process.env
        const web3 = new Web3()
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