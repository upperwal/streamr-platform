// @flow
/* eslint-disable */
import React, { useRef, useCallback, useContext, type Node } from 'react'
import cx from 'classnames'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import ModuleUI from '$editor/shared/components/ModuleUI'
import HamburgerButton from '$editor/shared/components/HamburgerButton'
import ModuleHeader from '$editor/shared/components/ModuleHeader'
import * as RunController from '../RunController'
import { Resizer } from '../Resizer'
import Ports from '../Ports'

import styles from './module.pcss'

type ModuleLayout = {
    height: number,
    position: {
        left: number,
        top: number,
    },
    width: number,
}

type Props = {
    // FIXME: Types.
    api: any,
    // FIXME: Types.
    canvas: any,
    children: Node,
    className?: string,
    module: {
        displayName: string,
        hash: string,
        jsModule: string,
        layout: ModuleLayout,
        name: string,
        widget: string,
        // FIXME: Types.
        params: any,
    },
    moduleSidebarIsOpen?: boolean,
    // FIXME: Types.
    onPort: any,
    resizeable?: boolean,
    selectedModuleHash: string,
    style?: any,
}

const Module = ({
    api,
    canvas,
    children,
    className,
    module,
    moduleSidebarIsOpen,
    onPort,
    resizeable,
    selectedModuleHash,
    style,
    ...props
}: Props) => {
    const runController = useContext(RunController.Context)
    const {
        layout: { width: minWidth, height: minHeight },
        hash,
        jsModule,
        widget,
        displayName,
        name,
        params,
    } = module
    const el = useRef(null)
    const isSelected = hash === selectedModuleHash
    const onFocus = useCallback(() => api.selectModule({
        hash,
    }), [api, hash])
    const onChangeModuleName = useCallback((value) => (
        api.renameModule(hash, value)
    ), [api])
    const onFocusOptionsButton = useCallback((e: SyntheticEvent<EventTarget>) => {
        e.stopPropagation() /* skip parent focus behaviour */
    }, [])
    const onTriggerOptions = useCallback((e: SyntheticEvent<EventTarget>) => {
        e.stopPropagation()
        // need to selectModule here rather than in parent focus handler
        // otherwise selection changes before we can toggle open/close behaviour
        api.selectModule({
            hash,
        })
        if (isSelected) {
            // toggle sidebar if same module
            api.moduleSidebarOpen(!moduleSidebarIsOpen)
        } else {
            // only open if different
            api.moduleSidebarOpen(true)
        }
    }, [api, hash, isSelected, moduleSidebarIsOpen])
    const onPortValueChange = useCallback((portId: any, value: any) => {
        api.port.onChange(portId, value, () => {
            // Check if reload is needed after the change
            const port = params.find((p) => p.id === portId)

            if (!!el.current && port && port.updateOnChange && port.value === value) {
                api.loadNewDefinition(hash)
            }
        })
    }, [api, params])
    const moduleSpecificClassNames = [ModuleStyles[jsModule], ModuleStyles[widget]]

    return (
        <div
            role="rowgroup"
            /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
            tabIndex="0"
            onFocus={onFocus}
            className={cx(className, styles.root, ModuleStyles.ModuleBase, ...moduleSpecificClassNames, {
                [ModuleStyles.isSelected]: isSelected,
            })}
            style={{
                ...style,
                minWidth,
                minHeight,
            }}
            data-modulehash={hash}
            ref={el}
            {...props}
        >
            <div className={ModuleStyles.selectionDecorator} />
            <ModuleHeader
                className={cx(styles.header, ModuleStyles.dragHandle)}
                editable={!runController.isActive}
                label={module.displayName || module.name}
                onLabelChange={onChangeModuleName}
            >
                <HamburgerButton
                    className={ModuleStyles.dragCancel}
                    onFocus={onFocusOptionsButton}
                    onClick={onTriggerOptions}
                />
            </ModuleHeader>
            <Ports
                className={styles.ports}
                api={api}
                module={module}
                canvas={canvas}
                onPort={onPort}
                onValueChange={onPortValueChange}
            />
            <ModuleUI
                className={styles.canvasModuleUI}
                api={api}
                module={module}
                canvas={canvas}
                moduleHash={hash}
                canvasId={canvas.id}
                isActive={!!runController.isRunning}
                isSubscriptionActive={!!runController.isActive}
            />
            {!!resizeable && (
                <Resizer
                    api={api}
                    module={module}
                    target={el}
                />
            )}
        </div>
    )
}

Module.styles = styles

export default Module
