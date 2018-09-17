// @flow

const abi = require('./abis/token.json')
const bytecode = require('./bytecode/token.js')

module.exports = {
    abi,
    bytecode,
    environments: {
        e2e: {
            address: '0x1B4A7770F4800d0276B3daaC87e7ac9d33C20a1F',
        },
        development: {
            address: '0x8e3877fe5551f9c14bc9b062bbae9d84bc2f5d4e',
        },
        production: {
            address: '0x0Cf0Ee63788A0849fE5297F3407f701E122cC023',
        },
    },
}
