// @flow

// Network IDs introduced in utils/constants.js

module.exports = {
    environments: {
        production: {
            networkId: 1,
            publicNodeAddress: 'https://mainnet.infura.io',
        },
        development: {
            networkId: 4,
            publicNodeAddress: 'https://rinkeby.infura.io',
        },
        e2e: {
            networkId: 4,
            publicNodeAddress: 'http://127.0.0.1:7545',
        },
        get default() {
            return this.development
        },
    },
}
