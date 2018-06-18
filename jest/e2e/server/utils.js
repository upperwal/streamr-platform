const Web3 = require('web3')
const Watcher = require('streamr-ethereum-watcher/src/watcher') // eslint-disable-line 
const Informer = require('streamr-ethereum-watcher/src/informer') // eslint-disable-line 
const { sendFrom } = require('streamr-ethereum-watcher/src/utils') // eslint-disable-line 
const Marketplace = require('../../../src/web3/marketplace.config.js') // eslint-disable-line 
const Token = require('../../../src/web3/token.config.js')
const { postRequest, getRequest } = require('./requests')

const isPaidProduct = (p) => !p.isFree
const getProductAddress = (p) => `0x${p.id}`
const setDelay = (action, delay) => async (...args) => new Promise((resolve) => {
    setTimeout(() => resolve(action(...args)), delay)
})

module.exports = {
    getInitialProducts: () => getRequest('products?publicAccess=true'),
    setEthIdentity: async () => {
        const { WALLET_PRIVATE_KEY, WALLET_ADDRESS } = process.env

        const web3 = new Web3()
        const challenge = await postRequest('login/challenge')
        const signedChallenge = web3.eth.accounts.sign(challenge.challenge, WALLET_PRIVATE_KEY)
        const response = {
            address: WALLET_ADDRESS,
            name: 'e2e-testing',
            service: 'ETHEREUM_ID',
            challenge,
            signature: signedChallenge.signature,
        }
        return postRequest('integration_keys', response)
            .then(() => console.info(`Ethereum identity '${WALLET_ADDRESS}' by '${WALLET_PRIVATE_KEY}' added.`))
            .catch(() => console.debug(`Ethereum identity '${WALLET_ADDRESS}' is already set.`))
    },
    startWatcherAndInformer: (web3) => (contracts) => {
        const { API_URL, DEVOPS_KEY } = process.env
        const watcher = new Watcher(web3, contracts.marketplace.options.address)
        const informer = new Informer(API_URL, DEVOPS_KEY)

        informer.logger = console.log
        watcher.logger = console.log

        watcher.on('productDeployed', setDelay(informer.setDeployed.bind(informer), 2000))
        watcher.on('productUndeployed', setDelay(informer.setUndeployed.bind(informer), 2000))
        watcher.on('productUpdated', setDelay(informer.productUpdated.bind(informer), 2000))
        watcher.on('subscribed', setDelay(informer.subscribe.bind(informer), 2000))
        watcher.start()

        console.info('Watcher running')
        return contracts
    },
    deploy: (web3) => async (initialProducts) => {
        const accounts = await web3.eth.getAccounts()
        const ownerAddress = accounts[0]
        const token = await sendFrom(ownerAddress, new web3.eth.Contract(Token.abi).deploy({
            data: Token.bytecode,
            arguments: [],
        }))
        const marketplace = await sendFrom(ownerAddress, new web3.eth.Contract(Marketplace.abi).deploy({
            data: Marketplace.bytecode,
            arguments: [
                token.options.address,
                ownerAddress,
            ],
        }))
        /* eslint-disable */
        for (let product of initialProducts.filter(isPaidProduct)) {
            console.info(`Creating product ${product.name} (${product.id})`)
            await sendFrom(ownerAddress, marketplace.methods.createProduct(
                getProductAddress(product),
                product.name,
                ownerAddress,
                product.pricePerSecond,
                product.priceCurrency == "DATA" ? 0 : 1,
                product.minimumSubscriptionInSeconds
            ))

            if (product.state == "NOT_DEPLOYED") {
                console.info(`Deleting product ${product.name} (${product.id})`)
                await sendFrom(ownerAddress, marketplace.methods.deleteProduct(getProductAddress(product)))
            }
        }

        for (let account of accounts) {
            console.info(`Minting tokens for ${account}`)
            await sendFrom(ownerAddress, token.methods.mint(account, 100e18))
        }
        /* eslint-enable */

        return {
            token,
            marketplace,
        }
    },
}
