// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { I18n } from 'react-redux-i18n'
import { push } from 'react-router-redux'

import { saveCurrentUser } from '$shared/modules/user/actions'
import Toolbar from '$shared/components/Toolbar'
import TOCPage from '$userpages/components/TOCPage'

import Layout from '../Layout'
import ProfileSettings from './ProfileSettings'
import APICredentials from './APICredentials'
import IntegrationKeyHandler from './IntegrationKeyHandler'
import IdentityHandler from './IdentityHandler/index'
import DeleteAccount from './DeleteAccount'
import styles from './profilePage.pcss'
import routes from '$routes'

type StateProps = {
}

type DispatchProps = {
    saveCurrentUser: () => Promise<void>,
    redirectToUserPages: () => void,
}

type Props = StateProps & DispatchProps

type State = {
    saving: boolean,
}

export class ProfilePage extends Component<Props, State> {
    state = {
        saving: false,
    }

    unmounted: boolean = false

    componentWillUnmount() {
        this.unmounted = true
    }

    onSave = () => {
        const { saveCurrentUser, redirectToUserPages } = this.props
        this.setState({
            saving: true,
        }, () => {
            try {
                saveCurrentUser()
                    .then(() => {
                        if (!this.unmounted) {
                            this.setState({
                                saving: false,
                            }, redirectToUserPages)
                        }
                    }, (e) => {
                        console.warn(e)

                        if (!this.unmounted) {
                            this.setState({
                                saving: false,
                            })
                        }
                    })
            } catch (e) {
                console.warn(e)

                this.setState({
                    saving: false,
                })
            }
        })
    }
    render() {
        const { saving } = this.state
        return (
            <Layout noHeader>
                <div className={styles.profilePage}>
                    <Toolbar actions={{
                        cancel: {
                            title: I18n.t('userpages.profilePage.toolbar.cancel'),
                            outline: true,
                            linkTo: '/u',
                        },
                        saveChanges: {
                            title: I18n.t('userpages.profilePage.toolbar.saveChanges'),
                            color: 'primary',
                            onClick: this.onSave,
                            disabled: saving,
                            spinner: saving,
                        },
                    }}
                    />
                    <div className="container">
                        <TOCPage title={I18n.t('userpages.profilePage.pageTitle')}>
                            <TOCPage.Section id="profile" title={I18n.t('userpages.profilePage.profile.title')}>
                                <ProfileSettings />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="api-keys"
                                title={I18n.t('userpages.profilePage.apiCredentials.title')}
                                linkTitle={I18n.t('userpages.profilePage.apiCredentials.linkTitle')}
                            >
                                <APICredentials />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="ethereum-accounts"
                                title={I18n.t('userpages.profilePage.ethereumAddress.title')}
                                linkTitle={I18n.t('userpages.profilePage.ethereumAddress.linkTitle')}
                            >
                                <IdentityHandler />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="private-keys"
                                title={I18n.t('userpages.profilePage.ethereumPrivateKeys.title')}
                                linkTitle={I18n.t('userpages.profilePage.ethereumPrivateKeys.linkTitle')}
                            >
                                <IntegrationKeyHandler />
                            </TOCPage.Section>
                            <TOCPage.Section
                                id="delete-account"
                                title={I18n.t('userpages.profilePage.deleteAccount.title')}
                                linkTitle={I18n.t('userpages.profilePage.deleteAccount.linkTitle')}
                            >
                                <DeleteAccount />
                            </TOCPage.Section>
                        </TOCPage>
                    </div>
                </div>
            </Layout>
        )
    }
}

const mapStateToProps = (): StateProps => ({})

const mapDispatchToProps = (dispatch: Function): DispatchProps => ({
    saveCurrentUser: () => dispatch(saveCurrentUser()),
    redirectToUserPages: () => dispatch(push(routes.userPages())),
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
