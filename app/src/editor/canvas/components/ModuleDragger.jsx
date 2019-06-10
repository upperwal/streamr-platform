import React, { useCallback, useMemo } from 'react'

import { Draggable } from './DragDropContext'
import ModuleStyles from '$editor/shared/components/Module.pcss'
import styles from './Module.pcss'

const bounds = {
    top: 0,
    left: 0,
}

const dragCancelClass = `.${ModuleStyles.dragCancel}`
const dragHandleClass = `.${ModuleStyles.dragHandle}`

export default function ModuleDragger({ module, children, onDragEnd }) {
    const moduleHash = module.hash

    const onDropModule = useCallback((event, data) => {
        if (data.diff.x === 0 && data.diff.y === 0) {
            return // do nothing if not moved
        }

        const newPosition = {
            top: data.y,
            left: data.x,
        }

        onDragEnd(moduleHash, newPosition)
    }, [moduleHash, onDragEnd])

    const onStartDragModule = useCallback(() => ({
        moduleHash,
    }), [moduleHash])

    const { layout } = module
    const { position } = (layout || {})
    const defaultPosition = useMemo(() => ({
        x: (position && parseInt(position.left, 10)) || 0,
        y: (position && parseInt(position.top, 10)) || 0,
    }), [position])

    return (
        <Draggable
            defaultClassNameDragging={styles.isDragging}
            cancel={dragCancelClass}
            handle={dragHandleClass}
            bounds={bounds}
            defaultPosition={defaultPosition}
            onStop={onDropModule}
            onStart={onStartDragModule}
        >
            {children}
        </Draggable>
    )
}
