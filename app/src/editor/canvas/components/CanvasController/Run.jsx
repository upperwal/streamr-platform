/**
 * Handles starting & stopping a canvas.
 */

import React, { useContext, useState, useCallback, useMemo, useEffect } from 'react'
import get from 'lodash/get'

import useIsMountedRef from '$shared/utils/useIsMountedRef'
import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import { Context as PermissionContext } from '$editor/canvas/hooks/useCanvasPermissions'
import usePending from '$editor/shared/hooks/usePending'

import * as services from '../../services'
import * as CanvasState from '../../state'

import useCanvasStateChangeEffect from '../../hooks/useCanvasStateChangeEffect'
import useCanvasUpdater from './useCanvasUpdater'
import useCanvas from './useCanvas'

export const RunControllerContext = React.createContext()

const EMPTY = {}

function isStateNotAllowedError(error) {
    if (!error) { return false }
    const errorData = get(error, 'response.data')
    return !!errorData && errorData.code === 'STATE_NOT_ALLOWED'
}

function useRunController() {
    const canvas = useCanvas() || EMPTY
    const subscriptionStatus = useContext(SubscriptionStatus.Context)
    const { permissions } = useContext(PermissionContext)
    const { replaceCanvas } = useCanvasUpdater()
    const isMountedRef = useIsMountedRef()

    const createAdhocPending = usePending('CREATE ADHOC')
    const startPending = usePending('START')
    const stopPending = usePending('STOP')
    const exitPending = usePending('EXIT')
    const unlinkPending = usePending('UNLINK')

    const [isStarting, setIsStarting] = useState(false) // true immediately before starting a canvas
    const [isStopping, setIsStopping] = useState(false) // true immediately before starting a canvas
    const [canvasDidRun, setCanvasDidRun] = useState(false) // true immediately before starting a canvas

    const isRunning = CanvasState.isRunning(canvas)
    const isHistorical = CanvasState.isHistoricalModeSelected(canvas)

    const hasSharePermission = permissions &&
        permissions.some((p) => p.operation === 'share')

    const hasWritePermission = permissions &&
        permissions.some((p) => p.operation === 'write')
    const canvasId = canvas.id

    useEffect(() => {
        // set did run to false if id changes
        setCanvasDidRun(false)
    }, [canvasId, setCanvasDidRun])

    const start = useCallback(async (_, options) => {
        if (isHistorical && !canvas.adhoc) {
            const newCanvas = await createAdhocPending.wrap(() => services.createAdhocCanvas(canvas))
            if (!isMountedRef.current) { return }
            replaceCanvas(() => newCanvas)
            return
        }
        setIsStarting(true)
        setCanvasDidRun(false)

        if (isHistorical) {
            await subscriptionStatus.onAllReady()
        }

        if (!isMountedRef.current) { return canvas }
        const newCanvas = await startPending.wrap(() => services.start(canvas, {
            clearState: !!options.clearState || isHistorical,
        }))
            .catch((err) => {
                if (isStateNotAllowedError(err)) {
                    return // trying to start an already started canvas, ignore
                }

                if (isMountedRef.current) { setIsStarting(false) }
                throw err
            })

        if (!isMountedRef.current) { return }
        if (newCanvas) {
            replaceCanvas(() => newCanvas)
        }
    }, [canvas, subscriptionStatus, startPending, createAdhocPending, isHistorical, isMountedRef, replaceCanvas])

    const unlinkParent = useCallback((canvas) => (
        unlinkPending.wrap(() => services.unlinkParentCanvas(canvas))
    ), [unlinkPending])

    const stop = useCallback(async (canvas) => {
        setIsStopping(true)
        return stopPending.wrap(() => services.stop(canvas))
            .then((canvas) => {
                if (!isMountedRef.current) { return }
                setCanvasDidRun(true)
                setIsStopping(false)
                return canvas
            }, async (err) => {
                if (isStateNotAllowedError(err)) {
                    if (!canvas.adhoc) { return } // trying to stop an already stopped canvas, ignore
                    const parent = await unlinkParent(canvas) // ensure adhoc canvas gets unlinked
                    if (!isMountedRef.current) { return }
                    replaceCanvas(() => parent)
                    return
                }
                if (isMountedRef.current) {
                    setCanvasDidRun(true)
                    setIsStopping(false)
                }
                throw err
            })
    }, [stopPending, setIsStopping, isMountedRef, unlinkParent, replaceCanvas])

    const exit = useCallback(async (canvas) => {
        const newCanvas = await exitPending.wrap(() => services.loadParentCanvas(canvas))
        if (!isMountedRef.current) { return }
        return replaceCanvas((canvas) => CanvasState.copyLayout(newCanvas, canvas))
    }, [exitPending, replaceCanvas, isMountedRef])

    const unlinkAdhocOnStop = useCallback(async (isRunning) => {
        if (isRunning || !canvas.adhoc) { return }
        await unlinkParent(canvas)
    }, [canvas, unlinkParent])

    useCanvasStateChangeEffect(canvas, unlinkAdhocOnStop)

    // if state changes starting/stopping must have ended
    useCanvasStateChangeEffect(canvas, useCallback(() => setIsStarting(false), [setIsStarting]))
    useCanvasStateChangeEffect(canvas, useCallback((canvasIsRunning) => {
        setIsStopping(false)
        if (!canvasIsRunning) {
            setCanvasDidRun(true)
        }
    }, [setIsStopping]))

    const isAnyPending = [
        createAdhocPending,
        startPending,
        stopPending,
        exitPending,
        unlinkPending,
    ].some(({ isPending }) => isPending)

    // true if canvas exists and is starting or already running
    const isActive = canvas !== EMPTY && (isStarting || isRunning)

    const isPending = !!(isStarting || isStopping || isAnyPending)

    // e.g. move/resize but not commit
    const isAdjustable = !isPending

    // write commits
    const isEditable = (
        !isActive &&
        isAdjustable &&
        !canvas.adhoc &&
        hasWritePermission
    )

    // controls whether user can currently start/stop canvas
    const canChangeRunState = (
        !isPending && // no pending
        hasWritePermission && ( // has write perms
            // check historical settings ok if historical
            !isHistorical ||
            // don't prevent stopping running canvas if not valid
            isRunning ||
            CanvasState.isHistoricalRunValid(canvas)
        )
    )

    return useMemo(() => ({
        canChangeRunState,
        canvasDidRun,
        isStarting,
        isStopping,
        isPending,
        canvas: canvas.id,
        isActive,
        isRunning,
        isHistorical,
        isAdjustable,
        isEditable,
        hasSharePermission,
        hasWritePermission,
        start,
        stop,
        exit,
    }), [canvas, canvasDidRun, isStopping, isAdjustable, isPending, isStarting, isActive, isRunning, isHistorical, isEditable,
        hasSharePermission, hasWritePermission, start, stop, exit, canChangeRunState])
}

export default function RunControllerProvider({ children, canvas }) {
    return (
        <RunControllerContext.Provider value={useRunController(canvas)}>
            {children || null}
        </RunControllerContext.Provider>
    )
}

export {
    RunControllerContext as Context,
    RunControllerProvider as Provider,
}
