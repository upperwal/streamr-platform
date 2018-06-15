const axios = require('axios')
const Web3 = require('web3')
const Watcher = require('streamr-ethereum-watcher/src/watcher')
const Informer = require('streamr-ethereum-watcher/src/informer')
const Marketplace = require("../../../src/web3/marketplace.config.js")
const Token = require("../../../src/web3/token.config.js")
const { sendFrom } = require('streamr-ethereum-watcher/src/utils')

const debugTool = (debug, ...args) => {
    if (debug) {
        debugger
        console.debug(...args)
    }
}

const postRequest = (url, data = {}, options) => axios.post(url, data, options).then(r => r.data).catch((e) => debugTool(true, e.message))
const getRequest = (url, options = {}) => axios.get(url, options).then(r => r.data).catch((e) => debugTool(true, e.message))

const challenge = async () => {
    const { TESTER1_KEY, WALLET_PRIVATE_KEY, WALLET_ADDRESS, API_URL } = process.env
    const options = { headers: { Authorization: `Token ${process.env.TESTER1_KEY}` } }

    const challenge = await postRequest(`${API_URL}/login/challenge`, {}, options)
    const web3 = new Web3();
    const signedChallenge = web3.eth.accounts.sign(challenge.challenge, WALLET_PRIVATE_KEY)
    const response = {
        address: WALLET_ADDRESS,
        name: 'e2e',
        service: 'ETHEREUM_ID',
        challenge: challenge,
        signature: signedChallenge.signature
    }
    return postRequest(`${API_URL}/integration_keys`, response, options).then(() => console.info(`Ethereum identity '${WALLET_ADDRESS}' by '${WALLET_PRIVATE_KEY}' added.`))
}

module.exports = {
    setupEnvironment: () => {
        require('events').EventEmitter.defaultMaxListeners = 150;
        require('dotenv').config({
            path:'./.env.e2e'
        })
    },
    challenge: challenge,
    getInitialProducts: () => getRequest(`${process.env.API_URL}/products?publicAccess=true`),
    startWatcherAndInformer: (web3, debug) => (contracts) => {
        const watcher = new Watcher(web3, contracts.marketplace.options.address)
        const informer = new Informer(process.env.API_URL, process.env.DEVOPS_KEY)

        informer.logger = (method, apiUrl, body) => debugTool(debug, method, apiUrl, body)
        watcher.logger = message => debugTool(debug, message)

        watcher.on("productDeployed", async (...args) => {
            return await new Promise(resolve => {
                setTimeout(() => {
                    resolve(informer.setDeployed.bind(informer)(...args))
                }, 2000)
            })
        })

        watcher.on("productUndeployed", async (...args) => {
            return await new Promise(resolve => {
                setTimeout(() => {
                    resolve(informer.setUndeployed.bind(informer)(...args))
                }, 2000)
            })
        })
        watcher.on("productUpdated", async (...args) => {
            return await new Promise(resolve => {
                setTimeout(() => {
                    resolve(informer.productUpdated.bind(informer)(...args))
                }, 2000)
            })
        })
        watcher.on("subscribed", async (...args) => {
            return await new Promise(resolve => {
                setTimeout(() => {
                    resolve(informer.subscribe.bind(informer)(...args))
                }, 2000)
            })
        })
    
        watcher.start()

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
