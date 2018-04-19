// @flow

import { createAction } from 'redux-actions'

import { purchaseFlowSteps } from '../../utils/constants'
import { selectAllowance, selectPendingAllowance } from '../allowance/selectors'
import { toSeconds } from '../../utils/time'
import { setAllowance as setAllowanceToContract } from '../allowance/actions'
import { buyProduct } from '../purchase/actions'
import type { TimeUnit } from '../../flowtype/common-types'
import type { ProductId } from '../../flowtype/product-types'
import type { StoreState, PurchaseStep } from '../../flowtype/store-state'

import { selectProduct, selectPurchaseData } from './selectors'
import {
    INIT_PURCHASE,
    SET_STEP,
    SET_ACCESS_PERIOD,
} from './constants'
import type { StepActionCreator, ProductIdActionCreator, AccessPeriodActionCreator } from './types'

export const initPurchase: ProductIdActionCreator = createAction(
    INIT_PURCHASE,
    (id: ProductId) => ({
        id,
    }),
)

export const setStep: StepActionCreator = createAction(
    SET_STEP,
    (step: PurchaseStep) => ({
        step,
    }),
)

export const setAccessPeriodData: AccessPeriodActionCreator = createAction(
    SET_ACCESS_PERIOD,
    (time: number, timeUnit: TimeUnit) => ({
        time,
        timeUnit,
    }),
)

export const setAccessPeriod = (time: number, timeUnit: TimeUnit) => (dispatch: Function, getState: () => StoreState) => {
    dispatch(setAccessPeriodData(time, timeUnit))

    // Check if allowance is needed
    const state = getState()
    const product = selectProduct(state)

    if (!product) {
        throw new Error('Product should be defined!')
    }

    const allowance = Math.max(selectAllowance(state), selectPendingAllowance(state))
    const price = product.pricePerSecond * toSeconds(time, timeUnit)

    if (allowance < price) {
        dispatch(setStep(purchaseFlowSteps.ALLOWANCE))
    } else {
        dispatch(setStep(purchaseFlowSteps.SUMMARY))
    }
}

export const setAllowance = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectProduct(state)
    const purchase = selectPurchaseData(state)

    if (!product || !purchase) {
        throw new Error('Product and access data should be defined!')
    }

    const price = product.pricePerSecond * toSeconds(purchase.time, purchase.timeUnit)

    // Start the allowance transaction, we catch the RECEIVE_SET_ALLOWANCE_HASH action from allowance
    // in the reducer and set the next step there.
    dispatch(setAllowanceToContract(price))
}

export const approvePurchase = () => (dispatch: Function, getState: () => StoreState) => {
    const state = getState()
    const product = selectProduct(state)
    const purchase = selectPurchaseData(state)

    if (!product || !purchase) {
        throw new Error('Product and access data should be defined!')
    }

    const subscriptionTimeInSeconds = toSeconds(purchase.time, purchase.timeUnit)

    // Start the purchase transaction, we catch the RECEIVE_PURCHASE_HASH action from purchase
    // in the reducer and proceed to next step.
    dispatch(buyProduct(product.id || '', subscriptionTimeInSeconds))
}