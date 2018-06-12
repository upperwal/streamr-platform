// @flow

import abi from './abis/marketplace'
import bytecode from './bytecode/marketplace'

module.exports = {
    abi,
    bytecode,
    environments: {
        development: {
            address: '0x1FfC8cDd92Ac911C1f496a349857c8cF79C7C405',
        },
        production: {
            address: '0xA10151D088f6f2705a05d6c83719e99E079A61C1',
        },
        get default() {
            return this.development
        },
    },
}
