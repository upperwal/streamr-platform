const Marketplace = require("../../../src/web3/marketplace.config.js")
const Token = require("../../../src/web3/token.config.js")
const { sendFrom } = require('streamr-ethereum-watcher/src/utils')

module.exports = (web3) => async (initialProducts) => {
    const accounts = await web3.eth.getAccounts()
    const ownerAddress = accounts[0]
    const token = await sendFrom(ownerAddress, new web3.eth.Contract(Token.abi).deploy({ data: Token.bytecode, arguments: [] }))
    const marketplace = await sendFrom(ownerAddress, new web3.eth.Contract(Marketplace.abi).deploy({ data: Marketplace.bytecode, arguments: [
        token.options.address,
        ownerAddress,
    ]}))

    for (let p of initialProducts.filter(p => !p.isFree)) {
        console.log(`Creating product ${p.name} (${p.id})`)
        await sendFrom(ownerAddress, marketplace.methods.createProduct(
            "0x" + p.id,
            p.name,
            ownerAddress,
            p.pricePerSecond,
            p.priceCurrency == "DATA" ? 0 : 1,
            p.minimumSubscriptionInSeconds
        ))   
        if (p.state == "NOT_DEPLOYED") {
            await sendFrom(ownerAddress, marketplace.methods.deleteProduct("0x" + p.id))
        }
    }
    for (let a of accounts) {
        console.log(`Minting tokens for ${a}`)
        await sendFrom(ownerAddress, token.methods.mint(a, 100e18))
    }

    return {token, marketplace}
}
