// @flow

import React from 'react'
import { Translate } from 'react-redux-i18n'
import Link from '$shared/components/Link'
import LogoItem from './LogoItem'
import DropdownItem from './DropdownItem'
import LinkItem from './LinkItem'
import AvatarItem from './AvatarItem'
import routes from '$routes'
import navigationLinks from '$docs/components/DocsLayout/Navigation/navLinks'
import styles from './nav.pcss'

const Nav = () => (
    <nav
        className={styles.root}
    >
        <div>
            <LogoItem />
        </div>
        <div>
            {/* i18n! */}
            <DropdownItem label="Core" to="#" align="right">
                <Link
                    className={Nav.styles.link}
                    to={routes.streams()}
                >
                    <Translate value="general.streams" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.canvases()}
                >
                    <Translate value="general.canvases" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.dashboards()}
                >
                    <Translate value="general.dashboards" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.products()}
                >
                    <Translate value="general.products" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.purchases()}
                >
                    <Translate value="general.purchases" />
                </Link>
                <Link
                    className={Nav.styles.link}
                    to={routes.transactions()}
                >
                    <Translate value="general.transactions" />
                </Link>
            </DropdownItem>
            <LinkItem to={routes.root()}>Marketplace</LinkItem>
            <DropdownItem label="Docs" to="#" align="left">
                {Object.keys(navigationLinks).map((key) => (
                    <Link
                        key={key}
                        to={navigationLinks[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={Nav.styles.link}
                    >
                        {key}
                    </Link>
                ))}
            </DropdownItem>
            <AvatarItem />
        </div>
    </nav>
)

Nav.styles = styles

export default Nav
