// @flow

import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import type { Match } from 'react-router-dom'
import type { StoreState, PublishStep } from '../../../flowtype/store-state'
import type { TransactionState } from '../../../flowtype/common-types'
import ReadyToPublishDialog from '../../../components/Modal/ReadyToPublishDialog'
import CompletePublishDialog from '../../../components/Modal/CompletePublishDialog'
import { formatPath } from '../../../utils/url'
import { publishFlowSteps } from '../../../utils/constants'
import { selectStep } from '../../../modules/publishDialog/selectors'
import { publishProduct } from '../../../modules/publishDialog/actions'
import { selectPublishTransactionState } from '../../../modules/product/selectors'
import links from '../../../links'

type StateProps = {
    step: PublishStep,
    transactionState: ?TransactionState,
}

type DispatchProps = {
    onPublish: () => void,
    onCancel: () => void,
}

export type OwnProps = {
    match: Match,
}

type Props = StateProps & DispatchProps & OwnProps

const PublishDialog = ({ step, transactionState, onPublish, onCancel }: Props) => {
    switch (step) {
        case publishFlowSteps.CONFIRM:
            return (
                <ReadyToPublishDialog onPublish={onPublish} onCancel={onCancel} />
            )

        case publishFlowSteps.COMPLETE:
            return (
                <CompletePublishDialog publishState={transactionState} />
            )

        default:
            return null
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    step: selectStep(state),
    transactionState: selectPublishTransactionState(state),
})

const mapDispatchToProps = (dispatch: Function, ownProps: OwnProps): DispatchProps => ({
    onPublish: () => dispatch(publishProduct()),
    onCancel: () => dispatch(push(formatPath(links.products, ownProps.match.params.id))),
})

export default connect(mapStateToProps, mapDispatchToProps)(PublishDialog)