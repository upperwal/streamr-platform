// @flow

import React from 'react'
import { connect } from 'react-redux'
import { replace } from 'react-router-redux'

import ReadyToPublishDialog from '$mp/components/Modal/ReadyToPublishDialog'
import CompletePublishDialog from '$mp/components/Modal/CompletePublishDialog'
import CompleteContractProductPublishDialog from '$mp/components/Modal/CompleteContractProductPublishDialog'
import { formatPath } from '$mp/utils/url'
import { publishFlowSteps, transactionStates } from '$mp/utils/constants'
import { selectStep } from '$mp/modules/publishDialog/selectors'
import { publishOrCreateProduct } from '$mp/modules/publishDialog/actions'
import { selectFetchingContractProduct } from '$mp/modules/contractProduct/selectors'
import {
    selectFreeProductState as selectPublishFreeProductState,
    selectContractTransaction as selectPublishContractTransaction,
    selectContractError as selectPublishContractError,
} from '$mp/modules/publish/selectors'
import { selectCreateContractProductTransaction, selectCreateContractProductError } from '$mp/modules/createContractProduct/selectors'
import links from '$mp/../links'
import withContractProduct from '$mp/containers/WithContractProduct'
import type { StoreState, PublishStep } from '$mp/flowtype/store-state'
import type { TransactionState, ErrorInUi } from '$mp/flowtype/common-types'
import type { Product, ProductId } from '$mp/flowtype/product-types'
import type { TransactionEntity } from '$mp/flowtype/web3-types'

type StateProps = {
    step: PublishStep,
    publishContractProductTransaction: ?TransactionEntity,
    publishContractProductError: ?ErrorInUi,
    createContractProductTransaction: ?TransactionEntity,
    createContractProductError: ?ErrorInUi,
    publishFreeProductState: ?TransactionState,
    fetchingContractProduct: boolean,
}

type DispatchProps = {
    onPublish: () => void,
    onCancel: () => void,
}

export type OwnProps = {
    productId: ProductId,
    redirectOnCancel: boolean,
    product: Product,
}

type Props = StateProps & DispatchProps & OwnProps

export const PublishDialog = ({
    step,
    publishContractProductTransaction,
    publishContractProductError,
    createContractProductTransaction,
    createContractProductError,
    publishFreeProductState,
    fetchingContractProduct,
    onPublish,
    onCancel,
}: Props) => {
    switch (step) {
        case publishFlowSteps.CONFIRM:
            return (
                <ReadyToPublishDialog
                    waiting={fetchingContractProduct}
                    onPublish={onPublish}
                    onCancel={onCancel}
                />
            )

        case publishFlowSteps.CREATE_CONTRACT_PRODUCT: {
            let transactionState = transactionStates.STARTED

            if (createContractProductError) {
                transactionState = transactionStates.FAILED
            } else if (createContractProductTransaction) {
                transactionState = createContractProductTransaction.state
            }

            return (
                <CompleteContractProductPublishDialog
                    publishState={transactionState}
                    onCancel={onCancel}
                />
            )
        }

        case publishFlowSteps.PUBLISH_CONTRACT_PRODUCT: {
            let transactionState = transactionStates.STARTED

            if (publishContractProductError) {
                transactionState = transactionStates.FAILED
            } else if (publishContractProductTransaction) {
                transactionState = publishContractProductTransaction.state
            }

            return (
                <CompleteContractProductPublishDialog
                    publishState={transactionState}
                    onCancel={onCancel}
                />
            )
        }

        case publishFlowSteps.PUBLISH_FREE_PRODUCT:
            return (
                <CompletePublishDialog
                    publishState={publishFreeProductState}
                    onCancel={onCancel}
                />
            )

        default:
            return null
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    publishContractProductTransaction: selectPublishContractTransaction(state),
    publishContractProductError: selectPublishContractError(state),
    createContractProductTransaction: selectCreateContractProductTransaction(state),
    createContractProductError: selectCreateContractProductError(state),
    publishFreeProductState: selectPublishFreeProductState(state),
    fetchingContractProduct: selectFetchingContractProduct(state),
})

export const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    onPublish: () => dispatch(publishOrCreateProduct()),
    onCancel: () => {
        dispatch(replace(formatPath(links.products, ownProps.productId)))
    },
})

export default connect(mapStateToProps, mapDispatchToProps)(withContractProduct(PublishDialog))
