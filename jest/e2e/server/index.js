require('events').EventEmitter.defaultMaxListeners = 150;
require('dotenv').config({
    path:'./.env.e2e'
})

const Web3 = require('web3')
const Ganache = require("ganache-core")
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const deploy = require('./deploy')
const Watcher = require('streamr-ethereum-watcher/src/watcher')
const Informer = require('streamr-ethereum-watcher/src/informer')

const { BLOCK_CHAIN_PORT } = process.env

const server = Ganache.server({
    network_id: 4,
    mnemonic: "we make your streams come true",
    gasLimit: 5000000,
    debug: true,
    ws:true,
})
const getInitialProducts = async () => axios
    .get(`${process.env.API_URL}/products?publicAccess=true`).then(r => r.data)

const startWatcherAndInformer = (web3) => (contracts) => {
    const watcher = new Watcher(web3, contracts.marketplace.options.address)
    const informer = new Informer(process.env.API_URL, process.env.DEVOPS_KEY)

    watcher.on("productDeployed", informer.setDeployed.bind(informer))
    watcher.on("productUndeployed", informer.setUndeployed.bind(informer))
    watcher.on("productUpdated", informer.productUpdated.bind(informer))
    watcher.on("subscribed", informer.subscribe.bind(informer))

    watcher.on("event", e => { console.debug(e.event) })
    informer.logger = console.debug

    watcher.start()
    console.log("Watcher running")
    return contracts
}


let contracts = {}
const setContracts = c => {
    console.log("Contracts available")
    contracts = c
    return c
}

//const web3 = new Web3(Ganache.provider())
const web3 = new Web3()//"ws://127.0.0.1:7545") 

const app = express()
app.use(cors())
app.get('/contracts', (req, res) => {
    res.json({
        marketplace: contracts.marketplace.options.address,
        token: contracts.token.options.address
    })
})

module.exports = {
    start: async () => {
        debugger
        await server.listen(BLOCK_CHAIN_PORT, async (err, blockchain) => {
             console.log(`Running on ${BLOCK_CHAIN_PORT}`)
             web3.setProvider("ws://127.0.0.1:7545")
            await getInitialProducts()
                .then(deploy(web3))
                .then(setContracts)
                .then(startWatcherAndInformer(web3))
                .catch(console.debug)
        })
        await app.listen(4567, () => console.log('App listening on port 4567!'))
    },
    stop: async () => {
        await app.close()
        await server.close()
    }
}