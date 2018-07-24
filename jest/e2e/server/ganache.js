/* eslint-disable import/no-extraneous-dependencies */
require('events').EventEmitter.defaultMaxListeners = 150
require('../env')
const Web3 = require('web3')
const Ganache = require('ganache-core')
const {
    deploy,
    getInitialProducts,
    startWatcherAndInformer,
    setEthIdentity,
    isPortAvailable,
} = require('./utils')

let server = {
    close: () => console.info('Server running independently or already shutdown'),
}
const { GANACHE_PORT, NETWORK_ID, WEB3_PROVIDER } = process.env

module.exports = {
    stop: async () => server.close(),
    isNotRunning: () => isPortAvailable(GANACHE_PORT),
    start: async () => {
        const web3 = new Web3()
        server = Ganache.server({
            network_id: NETWORK_ID,
            mnemonic: 'we make your streams come true',
            gasLimit: 5000000,
        })
        setEthIdentity()
        await new Promise((resolve) =>
            server.listen(GANACHE_PORT, () => {
                console.info(`Ganache server running on ${GANACHE_PORT}`)
                console.info(`Network id: ${NETWORK_ID}`)
                web3.setProvider(WEB3_PROVIDER)
                getInitialProducts()
                    .then(deploy(web3))
                    .then(startWatcherAndInformer(web3))
                    .then(resolve)
                    .catch(console.debug)
            }))
    },
}
