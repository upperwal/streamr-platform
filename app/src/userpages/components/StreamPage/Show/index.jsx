// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { push } from 'react-router-redux'
import cx from 'classnames'
import { withRouter } from 'react-router-dom'
import MediaQuery from 'react-responsive'
import isEqual from 'lodash/isEqual'
import isEmpty from 'lodash/isEmpty'
import debounce from 'lodash/debounce'

import type { Stream, StreamId } from '$shared/flowtype/stream-types'
import type { StoreState } from '$shared/flowtype/store-state'
import type { User } from '$shared/flowtype/user-types'
import type { ResourceKeyId } from '$shared/flowtype/resource-key-types'
import {
    getMyStreamPermissions,
    getStream,
    openStream,
    updateStream,
    createStream,
    initEditStream,
    initNewStream,
    updateEditStream,
} from '$userpages/modules/userPageStreams/actions'
import { getMyResourceKeys } from '$shared/modules/resourceKey/actions'
import { selectEditedStream } from '$userpages/modules/userPageStreams/selectors'
import { selectUserData } from '$shared/modules/user/selectors'
import { selectAuthApiKeyId } from '$shared/modules/resourceKey/selectors'
import TOCPage from '$userpages/components/TOCPage'
import Toolbar from '$shared/components/Toolbar'
import routes from '$routes'
import links from '$shared/../links'
import breakpoints from '$app/scripts/breakpoints'

import Layout from '../../Layout'
import InfoView from './InfoView'
import KeyView from './KeyView'
import ConfigureView from './ConfigureView'
import PreviewView from './PreviewView'
import HistoryView from './HistoryView'

import styles from './streamShowView.pcss'

const { lg } = breakpoints

type StateProps = {
    editedStream: ?Stream,
    currentUser: ?User,
    authApiKeyId: ?ResourceKeyId,
}

type State = {
    saving: boolean,
    pendingAutosave: boolean,
    requestedAutosave: boolean,
}

type DispatchProps = {
    createStream: () => Promise<StreamId>,
    getStream: (id: StreamId) => Promise<void>,
    openStream: (id: StreamId) => void,
    getMyStreamPermissions: (id: StreamId) => void,
    save: (stream: ?Stream) => void,
    cancel: (pendingAutosave: boolean) => void,
    updateStream: (stream: Stream) => void,
    initEditStream: () => void,
    initNewStream: () => void,
    getKeys: () => void,
    redirectToUserPages: () => void,
}

type RouterProps = {
    match: {
        params: {
            id: string
        }
    },
    history: {
        replace: (string) => void,
    },
}

type Props = StateProps & DispatchProps & RouterProps

export class StreamShowView extends Component<Props, State> {
    state = {
        saving: false,
        pendingAutosave: false,
        requestedAutosave: false,
    }

    unmounted: boolean = false

    componentWillUnmount() {
        this.unmounted = true
    }

    componentDidMount() {
        this.initStreamShow()
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.editedStream && prevProps.editedStream) {
            if (this.autosaveNeeded(this.props.editedStream, prevProps.editedStream)) {
                this.debouncedAutosave()
            }
        }
    }

    autosaveNeeded = (currentStreamState: Stream, previousStreamState: Stream): boolean => {
        if ((!this.state.pendingAutosave && !isEmpty(currentStreamState) && (!isEqual(currentStreamState, previousStreamState)))
            || this.state.requestedAutosave) {
            this.setState({
                pendingAutosave: true,
                requestedAutosave: false,
            })
            return true
        }
        return false
    }

    requestAutosave = () => {
        this.setState({
            requestedAutosave: true,
        })
    }

    autosave = () => {
        const { editedStream } = this.props
        if (editedStream) {
            this.onSave(editedStream, false)
        }
    }

    debouncedAutosave = debounce(this.autosave, 3000)

    initStreamShow() {
        if (this.props.match.params.id) {
            this.initStream(this.props.match.params.id)
        } else {
            this.createStream()
        }
    }

    initStream = async (id: StreamId) => {
        const { getStream, openStream, getMyStreamPermissions, initEditStream } = this.props

        this.props.getKeys()
        getStream(id).then(() => {
            openStream(id)
            initEditStream()
        })
        getMyStreamPermissions(id)
    }

    createStream = async () => {
        const newStreamId = await this.props.createStream()

        if (this.unmounted) { return }
        this.props.history.replace(`${links.userpages.streamShow}/${newStreamId}`)
        this.initStream(newStreamId)
    }

    onSave = (editedStream: Stream, saveAndExit: boolean = true) => {
        const { save, redirectToUserPages } = this.props
        this.setState({
            saving: true,
        }, async () => {
            try {
                await save(editedStream)
                if (!this.unmounted) {
                    this.setState({
                        saving: false,
                        pendingAutosave: false,
                        requestedAutosave: false,
                    }, () => {
                        if (saveAndExit) {
                            return redirectToUserPages
                        }
                    })
                }
            } catch (e) {
                console.warn(e)

                if (!this.unmounted) {
                    this.setState({
                        saving: false,
                        pendingAutosave: false,
                        requestedAutosave: false,
                    })
                }
            }
        })
    }

    render() {
        const { editedStream, cancel, currentUser, authApiKeyId } = this.props
        const { pendingAutosave } = this.state

        return (
            <Layout noHeader noFooter>
                <div className={styles.streamShowView}>
                    <MediaQuery minWidth={lg.min}>
                        <Toolbar
                            altMobileLayout
                            actions={{
                                cancel: {
                                    title: I18n.t('userpages.profilePage.toolbar.cancel'),
                                    color: 'link',
                                    outline: true,
                                    onClick: () => {
                                        cancel(pendingAutosave)
                                    },
                                },
                                saveChanges: {
                                    title: I18n.t('userpages.profilePage.toolbar.saveAndExit'),
                                    color: 'primary',
                                    spinner: this.state.saving,
                                    onClick: () => {
                                        if (editedStream) {
                                            this.onSave(editedStream, true)
                                        }
                                    },
                                },
                            }}
                        />
                    </MediaQuery>
                    <MediaQuery maxWidth={lg.min}>
                        <Toolbar
                            altMobileLayout
                            actions={{
                                cancel: {
                                    title: I18n.t('userpages.profilePage.toolbar.cancel'),
                                    color: 'link',
                                    outline: true,
                                    onClick: () => {
                                        cancel(pendingAutosave)
                                    },
                                },
                                saveChanges: {
                                    title: I18n.t('userpages.profilePage.toolbar.saveAndExit'),
                                    color: 'primary',
                                    spinner: this.state.saving,
                                    onClick: () => {
                                        if (editedStream) {
                                            this.onSave(editedStream, true)
                                        }
                                    },
                                },
                            }}
                        />
                    </MediaQuery>
                    <div className={cx('container', styles.containerOverrides)}>
                        <TOCPage title="Set up your Stream">
                            <TOCPage.Section
                                id="details"
                                title="Details"
                            >
                                <InfoView />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="configure"
                                title="Configure"
                                customStyled
                            >
                                <ConfigureView
                                    requestAutosave={this.requestAutosave}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="preview"
                                title="Preview"
                            >
                                <PreviewView
                                    stream={editedStream}
                                    currentUser={currentUser}
                                    authApiKeyId={authApiKeyId}
                                    pendingAutosave={pendingAutosave}
                                />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="api-access"
                                title="API Access"
                                customStyled
                            >
                                <KeyView />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="historical-data"
                                title="Historical Data"
                                customStyled
                            >
                                <HistoryView
                                    streamId={editedStream && editedStream.id}
                                />
                            </TOCPage.Section>
                        </TOCPage>
                    </div>
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (state: StoreState): StateProps => ({
    editedStream: selectEditedStream(state),
    currentUser: selectUserData(state),
    authApiKeyId: selectAuthApiKeyId(state),
})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    createStream: () => dispatch(createStream({
        name: 'Untitled Stream',
        description: '',
    })),
    getStream: (id: StreamId) => dispatch(getStream(id)),
    getKeys: () => dispatch(getMyResourceKeys()),
    openStream: (id: StreamId) => dispatch(openStream(id)),
    getMyStreamPermissions: (id: StreamId) => dispatch(getMyStreamPermissions(id)),
    save: (stream: ?Stream) => {
        dispatch(openStream(null))
        if (stream) {
            const updateOrSave = stream.id ? updateStream : createStream
            return dispatch(updateOrSave(stream))
        }
    },
    redirectToUserPages: () => dispatch(push(routes.userPages())),
    cancel: (pendingAutosave: boolean) => {
        if (pendingAutosave) {
            // eslint-disable-next-line no-restricted-globals, no-alert
            if (confirm('You have unsaved changes, are you sure you want to leave this page?')) {
                dispatch(push(routes.userPageStreamListing()))
            } else {
                console.log('cancel1')
                dispatch(openStream(null))
                dispatch(updateEditStream(null))
                dispatch(push(routes.userPageStreamListing()))
            }
        } else {
            console.log('cancel2')
            dispatch(openStream(null))
            dispatch(updateEditStream(null))
            dispatch(push(routes.userPageStreamListing()))
        }
    },
    updateStream: (stream: Stream) => dispatch(updateStream(stream)),
    initEditStream: () => dispatch(initEditStream()),
    initNewStream: () => dispatch(initNewStream()),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter((StreamShowView)))
