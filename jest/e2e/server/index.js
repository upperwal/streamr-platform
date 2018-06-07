const Web3 = require('web3')
const Ganache = require("ganache-core");
const server = Ganache.server();
const deploy = require('./deploy')


require('dotenv').config({
    path:'./.env.e2e'
})
const { BLOCK_CHAIN_PORT } = process.env

server.listen(BLOCK_CHAIN_PORT, function(err, blockchain) {
    deploy(new Web3(server.provider)).catch(console.debug)
    console.log(`Running on ${BLOCK_CHAIN_PORT}`)
});

