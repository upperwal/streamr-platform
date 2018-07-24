// @flow

import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import App from './components/App'
import GlobalInfoWatcher from './containers/GlobalInfoWatcher'
import store from './store'
import './setup'
import './layout'
// import { getProductFromContract } from './modules/contractProduct/services'
import { getMyTokenBalance } from './modules/allowance/services'

// getProductFromContract('5af088ad787786fa4f42695275bec834eeb8e16a45f65f4b5c657bf8ad505aba')
//     .then(console.log, console.error)

getMyTokenBalance()
    .then(console.log, console.error)

const root = document.getElementById('root')

if (root) {
    render(
        <Provider store={store}>
            <GlobalInfoWatcher>
                <App />
            </GlobalInfoWatcher>
        </Provider>,
        root,
    )
} else {
    throw new Error('Root element could not be found.')
}
