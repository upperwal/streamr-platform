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
            networkId: process.env.NETWORK_ID,
            publicNodeAddress: process.env.PUBLIC_NODE_ADDRESS,
        },
        get default() {
            return this.development
        },
    },
}
