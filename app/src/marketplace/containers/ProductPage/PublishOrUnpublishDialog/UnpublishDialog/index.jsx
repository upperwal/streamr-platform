// @flow

import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import type { StoreState, PublishStep } from '$mp/flowtype/store-state'
import type { TransactionState, ErrorInUi } from '$mp/flowtype/common-types'
import type { Product, ProductId } from '$mp/flowtype/product-types'
import ReadyToUnpublishDialog from '$mp/components/Modal/ReadyToUnpublishDialog'
import CompleteUnpublishDialog from '$mp/components/Modal/CompleteUnpublishDialog'
import CompleteContractProductUnpublishDialog from '$mp/components/Modal/CompleteContractProductUnpublishDialog'
import { formatPath } from '$mp/utils/url'
import { publishFlowSteps, transactionStates } from '$mp/utils/constants'
import { selectStep } from '$mp/modules/publishDialog/selectors'
import { unpublishProduct } from '$mp/modules/publishDialog/actions'
import {
    selectFreeProductState as selectUnpublishFreeProductState,
    selectContractTransaction as selectUnpublishContractTransaction,
    selectContractError as selectUnpublishContractError,
} from '$mp/modules/unpublish/selectors'
import links from '$mp/../links'
import withContractProduct from '$mp/containers/WithContractProduct'
import type { TransactionEntity } from '$mp/flowtype/web3-types'

type StateProps = {
    step: PublishStep,
    unpublishContractProductTransaction: ?TransactionEntity,
    unpublishContractProductError: ?ErrorInUi,
    unpublishFreeProductState: ?TransactionState,
}

type DispatchProps = {
    onUnpublish: () => void,
    onCancel: () => void,
}

export type OwnProps = {
    productId: ProductId,
    product: Product,
    redirectOnCancel: boolean,
}

type Props = StateProps & DispatchProps & OwnProps

export const UnpublishDialog = ({
    step,
    unpublishContractProductTransaction,
    unpublishContractProductError,
    unpublishFreeProductState,
    onUnpublish,
    onCancel,
}: Props) => {
    switch (step) {
        case publishFlowSteps.CONFIRM:
            return (
                <ReadyToUnpublishDialog onUnpublish={onUnpublish} onCancel={onCancel} />
            )

        case publishFlowSteps.UNPUBLISH_CONTRACT_PRODUCT: {
            let transactionState = transactionStates.STARTED

            if (unpublishContractProductError) {
                transactionState = transactionStates.FAILED
            } else if (unpublishContractProductTransaction) {
                transactionState = unpublishContractProductTransaction.state
            }

            return (
                <CompleteContractProductUnpublishDialog onCancel={onCancel} publishState={transactionState} />
            )
        }

        case publishFlowSteps.UNPUBLISH_FREE_PRODUCT:
            return (
                <CompleteUnpublishDialog onCancel={onCancel} publishState={unpublishFreeProductState} />
            )

        default:
            return null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    unpublishContractProductTransaction: selectUnpublishContractTransaction(state),
    unpublishContractProductError: selectUnpublishContractError(state),
    unpublishFreeProductState: selectUnpublishFreeProductState(state),
})

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    onUnpublish: () => dispatch(unpublishProduct()),
    onCancel: () => {
        if (ownProps.redirectOnCancel === true) {
            dispatch(replace(formatPath(links.products, ownProps.productId)))
        }
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(UnpublishDialog))
