// @flow

import Web3 from 'web3'
import axios from 'axios'

const { BLOCK_CHAIN_URL } = process.env 
window.web3 = {
    currentProvider: new Web3.providers.HttpProvider(BLOCK_CHAIN_URL)
}
/*
console.debug(BLOCK_CHAIN_URL)

axios.get('http://localhost:4567/contracts')
.then((results) => {
    window.testContracts = results.data
})
*/
