import { useMemo, useCallback } from 'react'

import * as CanvasState from '../../state'

import useCanvasUpdater from './useCanvasUpdater'

function usePortActions() {
    const { setCanvas } = useCanvasUpdater()
    const setPortUserValue = useCallback((portId, value, done) => (
        setCanvas({ type: 'Set Port Value' }, (canvas) => (
            CanvasState.setPortUserValue(canvas, portId, value)
        ), done)
    ), [setCanvas])

    const setPortOptions = useCallback((portId, options) => (
        setCanvas({ type: 'Set Port Options' }, (canvas) => (
            CanvasState.setPortOptions(canvas, portId, options)
        ))
    ), [setCanvas])

    return useMemo(() => ({
        setPortUserValue,
        setPortOptions,
    }), [
        setPortUserValue,
        setPortOptions,
    ])
}

function useModuleActions() {
    const { setCanvas } = useCanvasUpdater()

    const updateModule = useCallback((hash, value) => (
        setCanvas({ type: 'Update Module' }, (canvas) => (
            CanvasState.updateModule(canvas, hash, (module) => ({
                ...module,
                ...value,
            }))
        ))
    ), [setCanvas])

    const renameModule = useCallback((hash, displayName) => (
        setCanvas({ type: 'Rename Module' }, (canvas) => (
            CanvasState.updateModule(canvas, hash, (module) => ({
                ...module,
                displayName,
            }))
        ))
    ), [setCanvas])

    const setModuleOptions = useCallback((hash, options) => (
        setCanvas({ type: 'Set Module Options' }, (canvas) => (
            CanvasState.setModuleOptions(canvas, hash, options)
        ))
    ), [setCanvas])

    const updateModuleSize = useCallback((moduleHash, diff) => (
        setCanvas({ type: 'Resize Module' }, (canvas) => (
            CanvasState.updateModuleSize(canvas, moduleHash, diff)
        ))
    ), [setCanvas])

    const moveModule = useCallback((moduleHash, newPosition) => (
        setCanvas({ type: 'Move Module' }, (canvas) => (
            CanvasState.updateModulePosition(canvas, moduleHash, newPosition)
        ))
    ), [setCanvas])

    return useMemo(() => ({
        updateModule,
        renameModule,
        setModuleOptions,
        updateModuleSize,
        moveModule,
    }), [
        updateModule,
        renameModule,
        setModuleOptions,
        updateModuleSize,
        moveModule,
    ])
}

function useCanvasActions() {
    const { setCanvas } = useCanvasUpdater()

    const removeModule = useCallback((hash) => (
        setCanvas({ type: 'Remove Module' }, (canvas) => (
            CanvasState.removeModule(canvas, hash)
        ))
    ), [setCanvas])

    const addModule = useCallback((moduleData) => (
        setCanvas({ type: 'Add Module' }, (canvas) => (
            CanvasState.addModule(canvas, moduleData)
        ))
    ), [setCanvas])

    const renameCanvas = useCallback((name) => (
        setCanvas({ type: 'Rename Canvas' }, (canvas) => ({
            ...canvas,
            name,
        }))
    ), [setCanvas])

    const setRunTab = useCallback((runTab) => (
        setCanvas({ type: 'Set Run Tab' }, (canvas) => (
            CanvasState.updateCanvas(canvas, 'settings.editorState', (editorState = {}) => ({
                ...editorState,
                runTab,
            }))
        ))
    ), [setCanvas])

    const setHistorical = useCallback((update = {}) => (
        setCanvas({ type: 'Set Historical Range' }, (canvas) => (
            CanvasState.setHistoricalRange(canvas, update)
        ))
    ), [setCanvas])

    const setSpeed = useCallback((speed) => (
        setCanvas({ type: 'Set Speed' }, (canvas) => (
            CanvasState.updateCanvas(canvas, 'settings', (settings = {}) => ({
                ...settings,
                speed: String(speed),
            }))
        ))
    ), [setCanvas])

    const setSaveState = useCallback((serializationEnabled) => (
        setCanvas({ type: 'Set Save State' }, (canvas) => (
            CanvasState.updateCanvas(canvas, 'settings', (settings = {}) => ({
                ...settings,
                serializationEnabled: String(!!serializationEnabled) /* legacy compatibility. it wants a string */,
            }))
        ))
    ), [setCanvas])

    return useMemo(() => ({
        removeModule,
        addModule,
        renameCanvas,
        setRunTab,
        setHistorical,
        setSpeed,
        setSaveState,
    }), [
        removeModule,
        addModule,
        renameCanvas,
        setRunTab,
        setHistorical,
        setSpeed,
        setSaveState,
    ])
}

export default () => {
    const canvasActions = useCanvasActions()
    const moduleActions = useModuleActions()
    const portActions = usePortActions()
    return useMemo(() => ({
        ...canvasActions,
        ...moduleActions,
        ...portActions,
    }), [
        canvasActions,
        moduleActions,
        portActions,
    ])
}
