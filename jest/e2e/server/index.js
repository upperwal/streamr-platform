require('events').EventEmitter.defaultMaxListeners = 150
require('dotenv').config({
    path: './.env.e2e',
})

const Web3 = require('web3')
const Ganache = require("ganache-core") // eslint-disable-line 
const nodePortCheck = require('node-port-check') // eslint-disable-line 
const { deploy, getInitialProducts, startWatcherAndInformer, setEthIdentity } = require('./utils')

let server = {
    close: () => console.log('\nServer running independently or already shutdown\n'),
}

module.exports = {
    setup: setEthIdentity,
    stop: async () => server.close(),
    isNotRunning: async () => new Promise((resolve, reject) => {
        nodePortCheck(
            {
                port: process.env.BLOCK_CHAIN_PORT,
                maxRetries: 0,
            },
            (isPortAvailable) => (isPortAvailable ? resolve() : reject()),
        )
    }),
    start: async () => {
        const { BLOCK_CHAIN_PORT } = process.env
        const web3 = new Web3()
        server = Ganache.server({
            network_id: 4,
            mnemonic: 'we make your streams come true',
            gasLimit: 5000000,
        })
        await new Promise((resolve) =>
            server.listen(BLOCK_CHAIN_PORT, () => {
                console.info(`Ganache server running on ${BLOCK_CHAIN_PORT}`)
                web3.setProvider(`ws://localhost:${BLOCK_CHAIN_PORT}`)
                getInitialProducts()
                    .then(deploy(web3))
                    .then(startWatcherAndInformer(web3))
                    .then(resolve)
                    .catch(console.debug)
            }))
    },
}
