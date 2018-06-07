// @flow

import Web3 from 'web3'
//import Provider from "ganache-core/lib/provider"

//window.web3 = new Web3()
//window.web3.setProvider(new Provider())
const { BLOCK_CHAIN_URL } = process.env 
window.web3 = {
    currentProvider: new Web3.providers.HttpProvider(BLOCK_CHAIN_URL)
}