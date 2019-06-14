import React, { useContext, useCallback, useEffect, useState, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import Layout from '$mp/components/Layout'
import withErrorBoundary from '$shared/utils/withErrorBoundary'
import ErrorComponentView from '$shared/components/ErrorComponentView'

import links from '../../links'

import UndoContainer, { UndoControls } from '$editor/shared/components/UndoContainer'
import Subscription from '$editor/shared/components/Subscription'
import * as SubscriptionStatus from '$editor/shared/components/SubscriptionStatus'
import { ClientProvider } from '$editor/shared/components/Client'
import { ModalProvider } from '$editor/shared/components/Modal'
import * as sharedServices from '$editor/shared/services'
import BodyClass from '$shared/components/BodyClass'
import useIsMounted from '$shared/hooks/useIsMounted'
import Sidebar from '$editor/shared/components/Sidebar'
import { useSelectionContext, SelectionProvider } from '$editor/shared/hooks/useSelection'
import useLatch from '$editor/shared/hooks/useLatch'
import ModuleSidebar from './components/ModuleSidebar'
import KeyboardShortcutsSidebar from './components/KeyboardShortcutsSidebar'

import * as CanvasController from './components/CanvasController'
import * as RunController from './components/CanvasController/Run'
import useCanvas from './components/CanvasController/useCanvas'
import useCanvasUpdater from './components/CanvasController/useCanvasUpdater'
import useUpdatedTime from './components/CanvasController/useUpdatedTime'
import useCanvasActions from './components/CanvasController/useCanvasActions'

import Canvas from './components/Canvas'
import CanvasToolbar from './components/Toolbar'
import CanvasStatus, { CannotSaveStatus } from './components/Status'
import ModuleSearch from './components/ModuleSearch'

import useCanvasNotifications, { pushErrorNotification, pushWarningNotification } from './hooks/useCanvasNotifications'

import * as services from './services'
import * as CanvasState from './state'

import styles from './index.pcss'

const { RunStates } = CanvasState

const CanvasEditComponent = function CanvasEdit(props) {
    const {
        undo,
        runController,
        push,
        replace,
        selection,
        canvasActions,
        canvas,
        setUpdated,
        canvasController,
        history,
    } = props

    const [isDeleted, setIsDeleted] = useState(false)
    const moduleSearchLatch = useLatch(runController.isEditable, 'moduleSearchLatch')
    const moduleSidebarLatch = useLatch(false, 'moduleSidebarLatch')
    const keyboardShortcutsLatch = useLatch(false, 'keyboardShortcutsLatch')
    const isMounted = useIsMounted()
    const canvasRef = useRef()
    canvasRef.current = canvas
    const runControllerRef = useRef()
    runControllerRef.current = runController

    const {
        removeModule,
        renameCanvas,
        updateModule,
        renameModule,
        setModuleOptions,
        setRunTab,
        setHistorical,
        setSpeed,
        setSaveState,
    } = canvasActions

    // simulate setState onDone callback
    const queued = useRef([])
    useEffect(() => {
        if (!queued.current.length) { return }
        const fns = queued.current.slice()
        queued.current.length = 0
        if (!isMounted()) { return }
        fns.forEach((fn) => fn())
    }, [isMounted])

    const queueFn = useCallback((fn) => {
        if (typeof fn === 'function') {
            queued.current.push(fn)
        }
    }, [queued])

    const setCanvas = useCallback((action, fn, done) => {
        if (!isMounted()) { return }
        push(action, fn)
        queueFn(done)
    }, [isMounted, push, queueFn])

    const replaceCanvas = useCallback((fn, done) => {
        if (!isMounted()) { return }
        replace(fn)
        queueFn(done)
    }, [isMounted, replace, queueFn])

    const moduleSearchOpen = moduleSearchLatch.open

    const moduleSidebarOpen = useCallback((show = true) => {
        keyboardShortcutsLatch.close()
        moduleSidebarLatch.open(show)
    }, [keyboardShortcutsLatch, moduleSidebarLatch])

    const moduleSidebarClose = moduleSidebarLatch.close

    const keyboardShortcutOpen = useCallback((show = true) => {
        keyboardShortcutsLatch.open(show)
        moduleSidebarLatch.open(show)
    }, [keyboardShortcutsLatch, moduleSidebarLatch])

    const selectModule = useCallback(async ({ hash } = {}) => {
        if (hash == null) {
            selection.none()
            return
        }
        selection.only(hash)
    }, [selection])

    const selectedModule = selection.last()
    useEffect(() => {
        if (!selectedModule && moduleSidebarLatch.isOpen()) {
            moduleSidebarLatch.close()
        }
    }, [selectedModule, moduleSidebarLatch])

    const onKeyDown = useCallback((event) => {
        const hash = Number(event.target.dataset.modulehash)
        if (Number.isNaN(hash)) {
            return
        }

        if (event.code === 'Backspace' || event.code === 'Delete') {
            removeModule(hash)
        }
    }, [removeModule])

    useEffect(() => {
        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [onKeyDown])

    const canvasStart = useCallback(async (options = {}) => (
        runController.start(canvasRef.current, options)
    ), [runController, canvasRef])

    const canvasStop = useCallback(async () => (
        runController.stop(canvasRef.current)
    ), [runController, canvasRef])

    const canvasExit = useCallback(async () => (
        runController.exit(canvasRef.current)
    ), [runController, canvasRef])

    const loadSelf = useCallback(async () => (
        canvasController.load(canvasRef.current.id)
    ), [canvasController, canvasRef])

    const autostart = useCallback(async () => {
        if (isDeleted) { return } // do not autostart deleted canvases
        if (canvasRef.current.adhoc && !runController.isPending && !runController.isActive && !runController.canvasDidRun) {
            // do not autostart running/non-adhoc canvases
            return canvasStart()
        }
    }, [canvasRef, runController, isDeleted, canvasStart])

    const autosave = useCallback(async () => {
        if (isDeleted) { return } // do not autosave deleted canvases
        if (!runController.isEditable) {
            // do not autosave running/adhoc canvases or if we have no write permission
            return
        }
        const newCanvas = await services.autosave(canvasRef.current)
        if (!isMounted()) { return }
        // ignore new canvas, just extract updated time from it
        setUpdated(newCanvas.updated)
    }, [canvasRef, isDeleted, isMounted, runController, setUpdated])

    useEffect(() => {
        autosave()
        autostart()
        return () => {
            if (!isMounted()) {
                autosave()
            }
        }
    }, [autosave, autostart, isMounted])

    const { isEditable } = runController

    useEffect(() => {
        // canvas changed or became editable
        if (isEditable) {
            autosave()
        }
    }, [canvas, isEditable, autosave])

    const addModule = useCallback(async ({ id, configuration }) => {
        const moduleData = await canvasController.loadModule(canvas, {
            ...configuration,
            id,
        })

        if (!isMounted()) { return }

        canvasActions.addModule(moduleData)
    }, [canvasController, canvas, canvasActions, isMounted])

    const duplicateCanvas = useCallback(async () => (
        canvasController.duplicate(canvasRef.current)
    ), [canvasController])

    const deleteCanvas = useCallback(async () => {
        setIsDeleted(true)
        return canvasController.remove(canvasRef.current)
    }, [canvasRef, setIsDeleted, canvasController])

    const newCanvas = useCallback(() => (
        history.push(links.editor.canvasEditor)
    ), [history])

    const loadNewDefinition = useCallback(async (hash) => {
        try {
            const moduleData = await canvasController.loadModule(canvasRef.current, { hash })
            if (!isMounted()) { return }
            replace((canvas) => CanvasState.replaceModule(canvas, moduleData))
        } catch (error) {
            console.error(error)
            // undo value change
            undo()
        }
    }, [canvasRef, canvasController, replace, undo, isMounted])

    const pushNewDefinition = useCallback(async (hash, value) => {
        const module = CanvasState.getModule(canvasRef.current, hash)

        // Update the module info, this will throw if anything went wrong.
        const newModule = await sharedServices.getModule({
            id: module.id,
            configuration: {
                ...module,
                ...value,
            },
        })

        if (!isMounted()) { return }

        replaceCanvas((canvas) => (
            CanvasState.updateModule(canvas, hash, () => newModule)
        ))
    }, [replaceCanvas, canvasRef, isMounted])

    const onDoneMessage = useCallback(async () => {
        if (!runController.isPending && runController.isRunning) {
            loadSelf()
        }
    }, [runController, loadSelf])

    const onErrorMessage = useCallback(async (error) => {
        pushErrorNotification({
            message: error.error,
            error,
        })
        return loadSelf()
    }, [loadSelf])

    const onWarningMessage = useCallback(({ msg = '', hash, ...opts } = {}) => {
        if (hash != null) {
            const module = CanvasState.getModule(canvasRef.current, hash)
            if (module) {
                const moduleName = module.displayName || module.name
                msg = `${moduleName}: ${msg}`
            }
        }
        pushWarningNotification({
            message: msg,
            hash,
            ...opts,
        })
    }, [canvasRef])

    if (!canvas) {
        return (
            <div className={styles.CanvasEdit}>
                <CanvasToolbar className={styles.CanvasToolbar} />
            </div>
        )
    }

    const moduleSidebarIsOpen = moduleSidebarLatch.isOpen()
    const keyboardShortcutIsOpen = keyboardShortcutsLatch.isOpen()
    const { settings } = canvas
    const resendFrom = settings.beginDate
    const resendTo = settings.endDate
    return (
        <div className={styles.CanvasEdit}>
            <Helmet title={`${canvas.name} | Streamr Core`} />
            <Subscription
                uiChannel={canvas.uiChannel}
                resendFrom={canvas.adhoc ? resendFrom : undefined}
                resendTo={canvas.adhoc ? resendTo : undefined}
                isActive={runController.isActive}
                onDoneMessage={onDoneMessage}
                onWarningMessage={onWarningMessage}
                onErrorMessage={onErrorMessage}
            />
            <Canvas
                className={styles.Canvas}
                canvas={canvas}
                selectedModuleHash={selection.last()}
                canvasActions={canvasActions}
                selectModule={selectModule}
                updateModule={updateModule}
                renameModule={renameModule}
                moduleSidebarOpen={moduleSidebarOpen}
                moduleSidebarIsOpen={moduleSidebarIsOpen && !keyboardShortcutIsOpen}
                setCanvas={setCanvas}
                loadNewDefinition={loadNewDefinition}
                pushNewDefinition={pushNewDefinition}
            >
                {runController.hasWritePermission ? (
                    <CanvasStatus updated={props.updated} />
                ) : (
                    <CannotSaveStatus />
                )}
            </Canvas>
            <ModalProvider>
                <CanvasToolbar
                    className={styles.CanvasToolbar}
                    canvas={canvas}
                    setCanvas={setCanvas}
                    renameCanvas={renameCanvas}
                    deleteCanvas={deleteCanvas}
                    newCanvas={newCanvas}
                    duplicateCanvas={duplicateCanvas}
                    moduleSearchIsOpen={moduleSearchLatch.isOpen()}
                    moduleSearchOpen={moduleSearchOpen}
                    setRunTab={setRunTab}
                    setHistorical={setHistorical}
                    setSpeed={setSpeed}
                    setSaveState={setSaveState}
                    canvasStart={canvasStart}
                    canvasStop={canvasStop}
                    keyboardShortcutOpen={keyboardShortcutOpen}
                    canvasExit={canvasExit}
                />
            </ModalProvider>
            <Sidebar
                className={styles.ModuleSidebar}
                isOpen={moduleSidebarIsOpen}
            >
                {moduleSidebarIsOpen && keyboardShortcutIsOpen && (
                    <KeyboardShortcutsSidebar
                        onClose={() => keyboardShortcutOpen(false)}
                    />
                )}
                {moduleSidebarIsOpen && !keyboardShortcutIsOpen && (
                    <ModuleSidebar
                        onClose={moduleSidebarClose}
                        canvas={canvas}
                        selectedModuleHash={selection.last()}
                        setModuleOptions={setModuleOptions}
                    />
                )}
            </Sidebar>
            <ModuleSearch
                addModule={addModule}
                isOpen={runController.isEditable && moduleSearchLatch.isOpen()}
                open={moduleSearchLatch.open}
            />
        </div>
    )
}

const CanvasEdit = withRouter(({ canvas, ...props }) => {
    const runController = useContext(RunController.Context)
    const canvasController = CanvasController.useController()
    const [updated, setUpdated] = useUpdatedTime(canvas.updated)
    useCanvasNotifications(canvas)
    const selection = useSelectionContext()

    return (
        <CanvasEditComponent
            {...props}
            canvas={canvas}
            runController={runController}
            canvasController={canvasController}
            updated={updated}
            setUpdated={setUpdated}
            selection={selection}
        />
    )
})

const CanvasEditWrap = () => {
    const { replaceCanvas, setCanvas } = useCanvasUpdater()
    const canvasActions = useCanvasActions()
    const { undo } = useContext(UndoContainer.Context)
    const canvas = useCanvas()
    if (!canvas) {
        return (
            <div className={styles.CanvasEdit}>
                <CanvasToolbar className={styles.CanvasToolbar} />
            </div>
        )
    }

    const key = !!canvas && canvas.id

    return (
        <SubscriptionStatus.Provider key={key}>
            <RunController.Provider canvas={canvas}>
                <CanvasEdit
                    replace={replaceCanvas}
                    push={setCanvas}
                    undo={undo}
                    canvas={canvas}
                    canvasActions={canvasActions}
                />
            </RunController.Provider>
        </SubscriptionStatus.Provider>
    )
}

function isDisabled({ state: canvas }) {
    return !canvas || (canvas.state === RunStates.Running || canvas.adhoc)
}

const CanvasContainer = withRouter(withErrorBoundary(ErrorComponentView)((props) => (
    <ClientProvider>
        <UndoContainer key={props.match.params.id}>
            <UndoControls disabled={isDisabled} />
            <CanvasController.Provider>
                <SelectionProvider>
                    <CanvasEditWrap />
                </SelectionProvider>
            </CanvasController.Provider>
        </UndoContainer>
    </ClientProvider>
)))

export default () => (
    <Layout className={styles.layout} footer={false}>
        <BodyClass className="editor" />
        <CanvasContainer />
    </Layout>
)
