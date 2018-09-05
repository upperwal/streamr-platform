// @flow

import Web3 from 'web3'

// We don't want to override MetaMask in case the app is tested manually
if (typeof window.web3 === 'undefined') {
    const web3 = new Web3(process.env.WEB3_PROVIDER)

    // Give access to the local account
    web3.eth.accounts.wallet.add('0x0961b1b8028fa43057caf48c64874a5a131c12b1dac79bd43f1be0bebbc40dda')
    window.web3 = web3
}
