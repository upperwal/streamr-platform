const axios = require('axios')
const Watcher = require('streamr-ethereum-watcher/src/watcher')
const Informer = require('streamr-ethereum-watcher/src/informer')
const Marketplace = require("../../../src/web3/marketplace.config.js")
const Token = require("../../../src/web3/token.config.js")
const { sendFrom } = require('streamr-ethereum-watcher/src/utils')

const debugTool = (debug, ...args) => {
    if (debug) console.debug(...args)
}

module.exports = {
    getInitialProducts: async () => axios
        .get(`${process.env.API_URL}/products?publicAccess=true`).then(r => r.data),
    startWatcherAndInformer: (web3, debug) => (contracts) => {
        const watcher = new Watcher(web3, contracts.marketplace.options.address)
        const informer = new Informer(process.env.API_URL, process.env.DEVOPS_KEY)
    
        watcher.on("productDeployed", informer.setDeployed.bind(informer))
        watcher.on("productUndeployed", informer.setUndeployed.bind(informer))
        watcher.on("productUpdated", informer.productUpdated.bind(informer))
        watcher.on("subscribed", informer.subscribe.bind(informer))
    
        watcher.start()
        watcher.logger = message => debugTool(debug, message)
        informer.logger = (method, apiUrl, body) => debugTool(debug, method, apiUrl, body)
        console.info("Watcher running")
        return contracts
    },
    deploy: (web3, debug) => async (initialProducts) => {
        const accounts = await web3.eth.getAccounts()
        const ownerAddress = accounts[0]
        const token = await sendFrom(ownerAddress, new web3.eth.Contract(Token.abi).deploy({ data: Token.bytecode, arguments: [] }))
        const marketplace = await sendFrom(ownerAddress, new web3.eth.Contract(Marketplace.abi).deploy({ data: Marketplace.bytecode, arguments: [
            token.options.address,
            ownerAddress,
        ]}))
    
        for (let p of initialProducts.filter(p => !p.isFree)) {
            debugTool(debug, `Creating product ${p.name} (${p.id})`)
            await sendFrom(ownerAddress, marketplace.methods.createProduct(
                "0x" + p.id,
                p.name,
                ownerAddress,
                p.pricePerSecond,
                p.priceCurrency == "DATA" ? 0 : 1,
                p.minimumSubscriptionInSeconds
            ))

            if (p.state == "NOT_DEPLOYED") {
                debugTool(debug, `Deleting product ${p.name} (${p.id})`)
                await sendFrom(ownerAddress, marketplace.methods.deleteProduct("0x" + p.id))
            }
        }
        for (let a of accounts) {
            debugTool(debug, `Minting tokens for ${a}`)
            await sendFrom(ownerAddress, token.methods.mint(a, 100e18))
        }
    
        return {token, marketplace}
    }
    
}
