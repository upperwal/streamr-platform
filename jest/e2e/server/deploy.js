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

    return {token, marketplace}
}
