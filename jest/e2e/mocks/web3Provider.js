// @flow

// We don't want to override MetaMask in case the app is tested manually
if (typeof window.web3 === 'undefined') {
    window.web3 = {
        currentProvider: process.env.WEB3_PROVIDER,
    }
}
