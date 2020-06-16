// @flow

import React, { type Node } from 'react'
import cx from 'classnames'

import SvgIcon from '$shared/components/SvgIcon'

import styles from './Sidebar.pcss'

export type Props = {
    onClose: () => void,
    title: string,
    className?: string,
    children?: Node,
}

const Header = ({ title, onClose, className, children }: Props) => {
    const info = global.streamr.info()
    const { version, branch, hash } = info

    return (
        <div className={cx(styles.header, className)}>
            <div className={styles.titleRow}>
                <h3 className={cx(styles.name)}>{title}</h3>
                <button
                    type="button"
                    onClick={() => onClose()}
                    className={styles.iconButton}
                >
                    <SvgIcon name="crossHeavy" className={styles.icon} />
                </button>
            </div>
            <div className={styles.subtitle}>
                {children || (
                    <div className={styles.appInfo}>
                        Streamr Core {[version, branch, hash].filter(Boolean).join(' ')}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Header
