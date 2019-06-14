/**
 * Latch can be opened and closed.
 * Can set current value of latch on open.
 */
import { useCallback, useState, useMemo, useRef, useDebugValue } from 'react'

export default function useLatch(defaultState = undefined, name) {
    const [currentValue, setLatch] = useState(defaultState)
    useDebugValue([name, currentValue])
    const valueRef = useRef()
    valueRef.current = currentValue

    const toggle = useCallback(() => (
        setLatch((isOpen) => !isOpen)
    ), [setLatch])

    const open = useCallback((id = true) => (
        setLatch(id)
    ), [setLatch])

    const close = useCallback(() => (
        setLatch(false)
    ), [setLatch])

    const isOpen = useCallback(() => (
        valueRef.current != null &&
        valueRef.current !== false
    ), [valueRef])

    return useMemo(() => ({
        toggle,
        open,
        close,
        currentValue,
        setLatch,
        isOpen,
    }), [
        toggle,
        open,
        isOpen,
        close,
        currentValue,
        setLatch,
    ])
}

