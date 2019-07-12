// @flow

import React, { useEffect, useRef, useContext, useCallback } from 'react'
import cx from 'classnames'
import { type Ref } from '$shared/flowtype/common-types'
import { DropTarget, DragSource } from '../../PortDragger'
import { DragDropContext } from '../../DragDropContext'
import {
    arePortsOfSameModule,
    canConnectPorts,
    hasPort,
} from '../../../state'

import styles from './plug.pcss'

type Props = {
    api: any,
    onValueChange: any,
    onContextMenu: any,
    canvas: any,
    className?: ?string,
    disabled?: boolean,
    port: any,
    register?: ?(any, ?HTMLDivElement) => void,
}

const Plug = ({
    api,
    canvas,
    className,
    disabled,
    port,
    register,
    onContextMenu,
    onValueChange,
    ...props
}: Props) => {
    const ref: Ref<HTMLDivElement> = useRef(null)

    useEffect(() => {
        if (register) {
            register(port.id, ref.current)
        }

        return () => {
            if (register) {
                register(port.id, null)
            }
        }
    }, [ref, register, port.id])

    const { isDragging, data } = useContext(DragDropContext)
    const { sourceId, portId } = data || {}
    const fromId = sourceId || portId || null
    const dragInProgress = !!isDragging && portId != null
    const sourcePortId = dragInProgress ? fromId : null
    const draggingFromSameModule = dragInProgress && hasPort(canvas, sourcePortId) && arePortsOfSameModule(canvas, sourcePortId, port.id)
    const canDrop = dragInProgress && canConnectPorts(canvas, fromId, port.id)

    // don't show native context menu when right-click disabled.
    const preventRightClick = useCallback((event) => event.preventDefault(), [])

    return (
        <div
            {...props}
            onContextMenu={!disabled ? onContextMenu : preventRightClick}
            className={cx(styles.root, className, {
                [styles.allowDrop]: !disabled && !draggingFromSameModule && canDrop,
                [styles.idle]: !disabled && !dragInProgress,
                [styles.ignoreDrop]: !disabled && draggingFromSameModule,
                [styles.rejectDrop]: !disabled && dragInProgress && !draggingFromSameModule && !canDrop,
                [styles.disabled]: disabled,
            })}
        >
            <div
                className={cx(styles.inner, {
                    [styles.connected]: port.connected,
                    [styles.driver]: port.drivingInput,
                    [styles.exported]: port.export,
                    [styles.noRepeat]: port.noRepeat,
                    [styles.optional]: !port.requiresConnection,
                })}
                ref={ref}
                title={port.id}
            />
            <DropTarget
                className={cx(styles.dragger, styles.dropTarget)}
                port={port}
            />
            <DragSource
                api={api}
                className={cx(styles.dragger, styles.dragSource)}
                disabled={disabled}
                onValueChange={onValueChange}
                port={port}
            />
        </div>
    )
}

Plug.styles = styles

export default Plug
