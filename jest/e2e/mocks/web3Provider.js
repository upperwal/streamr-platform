// @flow

import Web3 from 'web3'
import axios from 'axios'

const { BLOCK_CHAIN_URL } = process.env 
window.web3 = {
    currentProvider: new Web3.providers.HttpProvider(BLOCK_CHAIN_URL)
}
