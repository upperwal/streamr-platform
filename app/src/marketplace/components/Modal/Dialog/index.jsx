// @flow

import React, { Component, type Node } from 'react'
import { Translate } from 'react-redux-i18n'
import classNames from 'classnames'

import Buttons, { type Props as ButtonsProps } from '../../Buttons'
import ModalDialog, { type Props as ModalDialogProps } from '../../ModalDialog'
import { dialogAutoCloseTimeout } from '../../../utils/constants'

import Container from './Container'
import TitleBar from './TitleBar'
import ContentArea from './ContentArea'
import HelpToggle from './HelpToggle'

import styles from './dialog.pcss'

type Props = {
    title?: string,
    children?: Node,
    helpText?: Node,
    waiting?: boolean,
    className?: string,
    contentClassName?: string,
    onClose: () => void,
    autoCloseAfter?: number, // in milliseconds, use this to close the dialog after a custom timeout
    autoClose?: boolean, // use this to close the dialog after default timeout
} & ButtonsProps & ModalDialogProps

type State = {
    isHelpOpen: boolean,
}

class Dialog extends Component<Props, State> {
    static defaultProps = {
        title: '',
        helpText: null,
        waiting: false,
        autoClose: false,
        autoCloseAfter: dialogAutoCloseTimeout,
    }

    state = {
        isHelpOpen: false,
    }

    componentDidMount() {
        const { autoClose, autoCloseAfter, onClose } = this.props
        if (autoClose) {
            this.autoCloseTimeoutId = setTimeout(onClose, autoCloseAfter)
        }
    }

    componentWillUnmount() {
        if (this.autoCloseTimeoutId) {
            clearTimeout(this.autoCloseTimeoutId)
        }
    }

    onHelpToggle = () => {
        this.setState({
            isHelpOpen: !this.state.isHelpOpen,
        })
    }

    autoCloseTimeoutId: ?TimeoutID

    render() {
        const {
            title,
            children,
            waiting,
            helpText,
            actions,
            className,
            contentClassName,
            onClose,
            ...otherProps
        } = this.props
        const { isHelpOpen } = this.state

        return (
            <ModalDialog className={classNames(styles.dialog, className)} onClose={() => onClose && onClose()} {...otherProps}>
                <Container>
                    <TitleBar>
                        {title}
                        {!!helpText && (
                            <HelpToggle active={isHelpOpen} onToggle={this.onHelpToggle} />
                        )}
                    </TitleBar>
                    <ContentArea className={contentClassName}>
                        {(!helpText || !isHelpOpen) && (!waiting ? children : (
                            <div>
                                <Translate value="modal.dialog.waiting" />
                            </div>
                        ))}
                        {(!!helpText && isHelpOpen) && helpText}
                    </ContentArea>
                    {!waiting && (!helpText || !this.state.isHelpOpen) && (
                        <Buttons className={styles.buttons} actions={actions} />
                    )}
                </Container>
            </ModalDialog>
        )
    }
}

export default Dialog
