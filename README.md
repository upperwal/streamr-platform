# Streamr Data Marketplace
The Data Marketplace is a storefront for the world’s data streams. It categorises, bundles, sorts and showcases all available data, 
both free and commercial on the Streamr Network, and acts as a single common interface for bringing together data buyers and sellers, 
who transact using $DATA. And we don’t take a transaction fee.

## Getting Started

### Frontend
```
npm install
npm start
```

Webpack is configured with hot reloading and will be served on http://localhost:3333

### Backend
To have the marketplace functional locally, you must install the docker envirnoment to match what is in production. Follow the instructions here: https://github.com/streamr-dev/streamr-docker-dev

Note that the instructions also include login credentials for the local marketplace app. 
## Project Structure
Development Branch -> Local environment (bleeding edge)

Master Branch (untagged) -> Production ready code

Master Branch (tagged releases) -> Production code - http://marketplace.streamr.com

### Deploying to Staging
A shared Staging environment does not exist yet. 
### Deploying to Production 
Follow these steps to push a new production release:

First check that there are no open tickets for critical/major bugs discovered on the developmnent branch recently that should not be pushed to production. 

To make life easier, nobody should push to the `development` branch while you're deploying, so let the team know you're deploying before you start.

```
git checkout master
git merge origin/development
npm version patch
git push
```

* At this point it's a good idea to check that Travis confirms all tests are passing. Then,

```
git push origin <tag>
```

Following a deployment, `package.json` on `master` will have a higher version that on `development` so it's imporant to update `development` with this change.

```
git checkout development
git merge origin/master
git push
````

The parameter patch means updating the last number of the version, eg. 1.0.0 -> 1.0.1. Possible parameter values are [<VERSION>, patch, minor, major]

### Production Hotfixes
Create new branch from master `hotfix/ticket-id-issue-title` 
Merge the approved branch to master and push a tagged incremental release. 

```
npm version patch
git push
```

* At this point it's a good idea to check that Travis confirms all tests are passing. Then,

```
git push --tags
```

Remember to mirror the same fix in the `development` branch with new tests or new test conditions that prove the new functionality if required. 
### Adding new Features

```
git checkout development
git pull
git checkout -b ticket-id-issue-title
```

Then write your code, and get the pull request approved by two developers, ideally with tests proving the functionality. Then, merge the PR into `development`.


## Deployment
- When production builds:
  - Webpack creates `.map`-file in `dist` -directory with bundled JS
  - Travis has script container (Runnes when deploying in production)
    - Creates a new release in Sentry by `TRAVIS_TAG`
    - Pushes source map -file from `dist` into Sentry with tagged release
    - Removes the `.map`-file so it doesn't end up in production

### Sentry
JavaScript error tracking from Sentry helps developers easily fix and prevent JavaScript errors in production as part of your commit-deploy-iterate workflow. 
Ask a powerful developer for access to the Sentry alerts.

## End To End -testing

### Running tests
Added a new commands: `test-e2e`
For mocking web3 on client, webpack-dev-server has to be ran on e2e -environment: `NODE_ENV=e2e npm run start`.
Then we can run test's against it: `npm run test-e2e`. if Ganache server isn't running in background, test setup will start it, but you can run it also separately `npm run e2e-server`.
This reduces some time and allows you actually browse the e2e-environment with your browser as well.

## File structure
Tests are located in `test/e2e` and all configurations and test environment is under `jest/e2e`

## Known issues and "fixes":
### isAuthenticated
When going directly to url, isAuthenticated isn't working as expected: ends up redirecting users out

### The page viewpoint is currently in tablet mode (default)
This needs to be take in consideration when testing, as some features might be hidden and are not clickable by design

### Delay issues
#### Browser delay
For consistency, slowed down browser so react can keep up with it. Without it, tests were failing more often with no apparent reason
#### Ganache watcher/informer
In original design the Ethereum network is much slower than freshly build local and it is not taken consideration to actually Engine And Editor instance.
When client were sending deploying into web3 -server and EAE simultaneously mysql transactions failed. *For a fix* we added delay in informer to simulate real live avoiding the issue.

### Static Addresses, mnemonic
Since we want a controlled environment for our test's we have `mnemonic: "we make your streams come true"` which seeds same addresses, we were able to use e2e-configs for marketplace and token addesses and accounts as well. *For simplicity, added configs in client build*

### Allowance
For some reason, when making tests, I found out the DATA allowance behaved inconsistently: used `10 DATA / hr` as price and when purchasing, allowance weren't fetched for purchaseDialog in time. Ended up changing the price to 20 which resolved the issue. Still unknown why variance in behaviour. 


### Working with Puppeteer
- [Usage](https://github.com/smooth-code/jest-puppeteer)
- [API](https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions)

#### Running Browser headlessless
If you want to test and debug in browser, you can add `{ headless:false }`-option in `/jest/e2e/setup.js` for lauching puppeteer
