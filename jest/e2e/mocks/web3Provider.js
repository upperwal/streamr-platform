// @flow

const { BLOCK_CHAIN_URL } = process.env
window.web3 = {
    currentProvider: BLOCK_CHAIN_URL,
}
