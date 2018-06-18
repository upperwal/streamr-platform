// @flow

import Web3 from 'web3'

const { BLOCK_CHAIN_URL } = process.env 
window.web3 = new Web3(BLOCK_CHAIN_URL)
