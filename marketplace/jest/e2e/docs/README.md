# End-to-end testing

## Running tests
To run the e2e tests these services/resources need to be found: `API`, `Ganache (Ethereum test RPC)`, `Marketplace static files` and `File server`. 
Before running the actual tests, all the services need to be available. The app needs to be built in `e2e` environment (with the `NODE_ENV=e2e` flag).

### More info:

#### Ganache
TestRPC used instead of Ethereum test network. A kind of like a local, private blockchain. Also deploys Marketplace and Token 
smart contracts, creates testing products and mints some tokens for the available addresses. Can be started with `npm run e2e-server` 
or (if it's not already running) in the `globalSetup` of `npm run test-e2e`.

#### File server (express)
The built files need to be served. In dev environment the easiest way is to use `webpack-dev-server` (`npm start`), but in some environments 
we don't want to run the `webpack-dev-server` in the background (for example due to the fact that it watches changes in the files). Then we can use 
the local express server. If the files are not already served, the express.js server starts automatically in with `npm run e2e-server`
or in the `globalSetup` of `npm run test-e2e`.

### When developing
First run the api with [streamr-docker-dev](https://github.com/streamr-dev/streamr-docker-dev). Then:
```
> NODE_ENV=e2e npm start
> npm run e2e-server
> npm run test-e2e
```

### In CI etc
The api needs to be available. Then:
```
> NODE_ENV=e2e npm run build
> npm run test-e2e
```

## File structure
Tests are located in `test/e2e` and all configurations and test environment is under `jest/e2e`. The config for running the tests is `jest.config.e2e.js`.

## Working with Ganache

### Static Addresses, mnemonic
Since we want a controlled environment for our test's we have `mnemonic: "we make your streams come true"` which seeds same addresses, 
we were able to use e2e-configs for marketplace and token addesses and accounts as well. *For simplicity, added configs in client build*

### Developing
It's possible to use the TestRPC also with MetaMask by adding the TestRPC to MetaMask as a "Private Network" by adding 
`http://localhost:7545` to MetaMask > > Settings > New RPC URL

### Debugging the TestRPC
The easiest way to check the status of the local RPC is to use [`wallet.ethereum.org`](http://wallet.ethereum.org) 
(uses MetaMask so the TestRPC needs to be added to it already). The page should look something like this:
<img src="images/wallet_ethereum_org.png" width="400" />
If the page says `PRIVATE-NET` and `<x time> since last block` (instead of "waiting for blocks") you know that the 
local RPC is working. 

#### Adding contracts
You can add Token and Marketplace contracts by adding them as "custom contracts" from Contracts > Custom contracts > Watch contract.
 Add [contract address](#useful-addresses-and-hashes), name and [json interface](src/web3/build). You can also add the Token from 
 Custom tokens > Watch token. These should only be needed to add once.
 
NB: The usage of Ganache desktop app is not recommended. It always starts it's own TestRPC without realising there's already one running. 
That leads to problems.

## Working with Puppeteer
- [Usage](https://github.com/smooth-code/jest-puppeteer)
- [API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md)

## Known issues and "fixes":

#### The page viewpoint is currently in tablet mode (default)
This needs to be take in consideration when testing, as some features might be hidden and are not clickable by design

#### Delay issues

##### Browser delay
For consistency, slowed down browser so react can keep up with it. Without it, tests were failing more often with no apparent reason
##### Ganache watcher/informer
In original design the Ethereum network is much slower than freshly build local and it is not taken consideration to actually Engine And Editor instance.
When client were sending deploying into web3 -server and EAE simultaneously mysql transactions failed. *For a fix* we added delay in informer to simulate real live avoiding the issue.

#### Running Browser headlessless
If you want to test and debug in browser, you can run the tests with `HEADLESS=false` environment variable

## Useful addresses and hashes
These *should* stay the same as long as the mnemonic stays the same. These are also the ones already configured into the app.

|                              	|                                                                    	|
|------------------------------	|--------------------------------------------------------------------	|
| Account #1 address           	| 0x725bF47F71061034757b37cC7B9F73671c7b2973                         	|
| Account #1 private key       	| 0x0961b1b8028fa43057caf48c64874a5a131c12b1dac79bd43f1be0bebbc40dda 	|
| Marketplace contract address 	| 0x1FfC8cDd92Ac911C1f496a349857c8cF79C7C405                         	|
| Token contract address       	| 0x1B4A7770F4800d0276B3daaC87e7ac9d33C20a1F                         	|
