import assert from 'assert-diff'

import reducer, { initialState } from '../../../../src/modules/relatedProducts/reducer'
import * as constants from '../../../../src/modules/relatedProducts/constants'

describe('relatedProducts - reducers', () => {
    it('has initial state', async () => {
        assert.deepEqual(reducer(undefined, {}), initialState)
    })

    it('handles request', () => {
        const expectedState = {
            ids: [],
            fetching: true,
            error: null,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.GET_RELATED_PRODUCTS_REQUEST,
            payload: {},
        }), expectedState)
    })

    it('handles success', () => {
        const expectedState = {
            ids: [1, 2],
            fetching: false,
            error: null,
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.GET_RELATED_PRODUCTS_SUCCESS,
            payload: {
                products: [1, 2],
            },
        }), expectedState)
    })

    it('handles failure', () => {
        const error = new Error('Test')

        const expectedState = {
            ids: [],
            fetching: false,
            error: {},
        }

        assert.deepEqual(reducer(undefined, {
            type: constants.GET_RELATED_PRODUCTS_FAILURE,
            payload: {
                error,
            },
        }), expectedState)
    })
})
