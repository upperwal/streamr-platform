// @flow

import abi from './abis/token'
import bytecode from './bytecode/token'

module.exports = {
    abi,
    bytecode,
    environments: {
        development: {
            address: '0x8e3877fe5551f9c14bc9b062bbae9d84bc2f5d4e',
        },
        production: {
            address: '0x0Cf0Ee63788A0849fE5297F3407f701E122cC023',
        },
        get default() {
            return this.development
        },
    },
}
