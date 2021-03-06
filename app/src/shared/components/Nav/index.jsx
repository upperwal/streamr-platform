// @flow

import React from 'react'
import cx from 'classnames'
import { withRouter, type Location } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { I18n, Translate } from 'react-redux-i18n'
import { selectUserData } from '$shared/modules/user/selectors'
import type { User } from '$shared/flowtype/user-types'
import Link from '$shared/components/Link'
import LogoItem from './LogoItem'
import DropdownItem from './DropdownItem'
import LinkItem from './LinkItem'
import AvatarItem from './AvatarItem'
import ActivityItem from './ActivityItem'
import routes from '$routes'
import docsLinks from '$shared/../docsLinks'

import styles from './nav.pcss'

type StateProps = {
    currentUser: ?User,
}
type Props = StateProps & {
    className?: ?string,
    location: Location,
}

const mapStateToProps = (state): StateProps => ({
    currentUser: selectUserData(state),
})

const Nav = compose(
    connect(mapStateToProps),
    withRouter,
)(({ currentUser, location: { pathname: redirect }, className }: Props) => (
    <nav
        className={cx(styles.root, className)}
    >
        <div>
            <LogoItem />
        </div>
        <div>
            <DropdownItem
                align="right"
                label={I18n.t('general.core')}
                to={routes.streams.index()}
            >
                <Link to={routes.streams.index()}>
                    <Translate value="general.streams" />
                </Link>
                <Link to={routes.canvases.index()}>
                    <Translate value="general.canvases" />
                </Link>
                <Link to={routes.dashboards.index()}>
                    <Translate value="general.dashboards" />
                </Link>
                <Link to={routes.products.index()}>
                    <Translate value="general.products" />
                </Link>
                <Link to={routes.purchases()}>
                    <Translate value="general.purchases" />
                </Link>
                <Link to={routes.transactions()}>
                    <Translate value="general.transactions" />
                </Link>
            </DropdownItem>
            <LinkItem
                to={routes.marketplace.index()}
                underlined
            >
                <Translate value="general.marketplace" />
            </LinkItem>
            <DropdownItem
                align="left"
                label={I18n.t('general.docs')}
                to={docsLinks.docs}
            >
                {[
                    <Link to={docsLinks.gettingStarted} key="gettingStarted">
                        <Translate value="general.gettingStarted" />
                    </Link>,
                    <Link to={docsLinks.streams} key="streams">
                        <Translate value="general.streams" />
                    </Link>,
                    <Link to={docsLinks.canvases} key="canvases">
                        <Translate value="general.canvases" />
                    </Link>,
                    <Link to={docsLinks.dashboards} key="dashboards">
                        <Translate value="general.dashboards" />
                    </Link>,
                    <Link to={docsLinks.products} key="products">
                        <Translate value="general.products" />
                    </Link>,
                    ...(process.env.DATA_UNIONS_DOCS ? [(
                        <Link to={docsLinks.dataUnions} key="dataUnions">
                            <Translate value="general.dataUnions" />
                        </Link>
                    )] : []),
                ]}
            </DropdownItem>
            {!!currentUser && process.env.ACTIVITY_QUEUE && (
                <ActivityItem />
            )}
            {!!currentUser && (
                <AvatarItem user={currentUser} />
            )}
            {!currentUser && (
                <LinkItem
                    to={routes.auth.login(redirect !== '/' ? {
                        redirect,
                    } : {})}
                    underlined
                >
                    <Translate value="general.signIn" />
                </LinkItem>
            )}
            {!currentUser && (
                <LinkItem
                    className={Nav.styles.button}
                    to={routes.auth.signUp()}
                >
                    <Translate value="general.signUp" />
                </LinkItem>
            )}
        </div>
    </nav>
))

Nav.styles = styles

export default Nav
