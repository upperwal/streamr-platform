// @flow

import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Translate } from 'react-redux-i18n'
import { formatPath } from '$shared/utils/url'
import { Link } from 'react-router-dom'

import links from '$shared/../links'
import type { StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { ResourceKeyId, ResourceKey, ResourcePermission } from '$shared/flowtype/resource-key-types'
import CredentialsControl from '../../../ProfilePage/APICredentials/CredentialsControl'
import { addStreamResourceKey, editStreamResourceKey, removeStreamResourceKey, getStreamResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectOpenStreamId, selectOpenStreamResourceKeys } from '$userpages/modules/userPageStreams/selectors'

import styles from './keyView.pcss'

type OwnProps = {
    disabled: boolean,
}

type StateProps = {
    streamId: ?StreamId,
    keys: Array<ResourceKey>
}

type DispatchProps = {
    getKeys: (streamId: StreamId) => void,
    addKey: (streamId: StreamId, keyName: string, keyPermission: ResourcePermission) => Promise<void>,
    editStreamResourceKey: (streamId: StreamId, keyId: ResourceKeyId, keyName: string, keyPermission: ResourcePermission) => Promise<void>,
    removeKey: (streamId: StreamId, keyId: ResourceKeyId) => Promise<void>
}

type Props = OwnProps & StateProps & DispatchProps

export class KeyView extends Component<Props> {
    componentDidMount() {
        this.getKeys()
    }

    componentDidUpdate(prevProps: Props) {
        // get keys if streamId/disabled changes
        if (prevProps.streamId !== this.props.streamId || prevProps.disabled !== this.props.disabled) {
            this.getKeys()
        }
    }

    getKeys = () => {
        if (this.props.disabled || this.props.streamId == null) { return }
        this.props.getKeys(this.props.streamId)
    }

    addKey = async (key: string, permission: ?ResourcePermission): Promise<void> => {
        if (this.props.streamId == null) { return }
        const keyPermission = permission || 'read'
        return this.props.addKey(this.props.streamId, key, keyPermission)
    }

    editStreamResourceKey = (streamId: StreamId, keyId: ResourceKeyId, keyName: string, keyPermission: ResourcePermission): Promise<void> => (
        this.props.editStreamResourceKey(streamId, keyId, keyName, keyPermission)
    )

    removeKey = (keyId: ResourceKeyId): Promise<void> => this.props.removeKey(this.props.streamId || '', keyId)

    render() {
        const { disabled } = this.props
        const keys = this.props.keys || []
        return (
            <Fragment>
                <p className={styles.longText}>
                    <Translate value="userpages.streams.edit.apiCredentials.description" />
                    <Link to={formatPath(links.userpages.profile)}>Settings</Link>.
                </p>
                <CredentialsControl
                    keys={keys}
                    addKey={this.addKey}
                    editStreamResourceKey={this.editStreamResourceKey}
                    removeKey={this.removeKey}
                    showPermissionType
                    newStream={!this.props.streamId}
                    streamId={this.props.streamId}
                    disabled={disabled}
                />
            </Fragment>
        )
    }
}

export const mapStateToProps = (state: StoreState): StateProps => ({
    streamId: selectOpenStreamId(state),
    keys: selectOpenStreamResourceKeys(state),
})

export const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    getKeys(streamId: StreamId) {
        dispatch(getStreamResourceKeys(streamId))
    },
    addKey(streamId: StreamId, keyName: string, keyPermission: ResourcePermission) {
        return dispatch(addStreamResourceKey(streamId, keyName, keyPermission))
    },
    editStreamResourceKey(streamId: StreamId, keyId: ResourceKeyId, keyName: string, keyPermission: ResourcePermission) {
        return dispatch(editStreamResourceKey(streamId, keyId, keyName, keyPermission))
    },
    removeKey: (streamId: StreamId, keyId: ResourceKeyId): Promise<void> => dispatch(removeStreamResourceKey(streamId, keyId)),
})

export default connect(mapStateToProps, mapDispatchToProps)(KeyView)
