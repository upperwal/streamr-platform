const Web3 = require('web3')
const Ganache = require("ganache-core")
const express = require('express')
const cors = require('cors')
const axios = require('axios')
const deploy = require('./deploy')
const Watcher = require('streamr-ethereum-watcher/src/watcher')
const Informer = require('streamr-ethereum-watcher/src/informer')

const server = Ganache.server({
    network_id: 4,
    mnemonic: "we make your streams come true",
    gasLimit: 5000000
})


require('dotenv').config({
    path:'./.env.e2e'
})


const getInitialProducts = async (market, ownerAddress) => axios
    .get(`${process.env.API_URL}/products?publicAccess=true`).then(r => r.data)

const startWatcherAndInformer = (web3) => (contracts) => {
    const watcher = new Watcher(web3, contracts.marketplace.options.address)
    const informer = new Informer(process.env.API_URL, process.env.DEVOPS_KEY)

    watcher.on("productDeployed", informer.setDeployed.bind(informer))
    watcher.on("productUndeployed", informer.setUndeployed.bind(informer))
    watcher.on("productUpdated", informer.productUpdated.bind(informer))
    watcher.on("subscribed", informer.subscribe.bind(informer))

    watcher.start()
    console.log("Watcher running")
}

const { BLOCK_CHAIN_PORT } = process.env
let contracts = {}
server.listen(BLOCK_CHAIN_PORT, function(err, blockchain) {
    console.log(`Running on ${BLOCK_CHAIN_PORT}`)
    const web3 = new Web3(server.provider)
    getInitialProducts()
        .then(deploy(web3)) 
        .then(c => {
            console.log("API AVAIVALBE")
            contracts = c
            return c
        })
        .then(startWatcherAndInformer(web3))
        .catch(console.debug)
});


const app = express()
app.use(cors())
app.get('/contracts', (req, res) => {
    res.json({
        marketplace: contracts.marketplace.options.address,
        token: contracts.token.options.address
    })
})
app.listen(4567, () => console.log('App listening on port 4567!'))
