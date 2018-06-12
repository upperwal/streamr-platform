// @flow

const abi = require('./abis/marketplace.json')
const bytecode = require('./bytecode/marketplace.js')

module.exports = {
    abi,
    bytecode,
    environments: {
        e2e: {
            address: '0x1FfC8cDd92Ac911C1f496a349857c8cF79C7C405',
        },
        development: {
            address: '0x0af64558670a3b761B57e465Cb80B62254b39619',
        },
        production: {
            address: '0xA10151D088f6f2705a05d6c83719e99E079A61C1',
        },
        get default() {
            return this.development
        },
    },
}
