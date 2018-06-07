const Marketplace = require("../../../src/web3/marketplace.config.js")
const Token = require("../../../src/web3/token.config.js")

const { sendFrom } = require("./utils")

module.exports = async web3 => {
    const accounts = await web3.eth.getAccounts()
    debugger
    const token = await sendFrom(accounts[0], new web3.eth.Contract(Token.abi).deploy({ data: Token.bytecode, arguments: [] }))
    const marketplace = await sendFrom(accounts[0], new web3.eth.Contract(Marketplace.abi).deploy({ data: Marketplace.bytecode, arguments: [
        token.options.address,
        accounts[0]     // currencyUpdateAgent
    ]}))

    return {token, marketplace}
}
