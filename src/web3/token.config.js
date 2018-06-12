// @flow

import abi from './abis/token'
import bytecode from './bytecode/token'

module.exports = {
    abi,
    bytecode,
    environments: {
        development: {
            address: '0x1B4A7770F4800d0276B3daaC87e7ac9d33C20a1F',
        },
        production: {
            address: '0x0Cf0Ee63788A0849fE5297F3407f701E122cC023',
        },
        get default() {
            return this.development
        },
    },
}
