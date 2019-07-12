// @flow

import React, { useContext, useEffect } from 'react'
import cx from 'classnames'

import Probe from '$editor/canvas/components/Resizable/SizeConstraintProvider/Probe'
import { Context as SizeConstraintContext } from '../Resizable/SizeConstraintProvider'
import { DragDropContext } from '../DragDropContext'
import Port from './Port'
import styles from './ports.pcss'

type Props = {
    api: any,
    canvas: any,
    className?: ?string,
    disabled?: boolean,
    module: any,
    onPort: any,
    onValueChange: any,
}

const Ports = ({
    api,
    canvas,
    className,
    disabled,
    module,
    onPort,
    onValueChange,
}: Props) => {
    const { outputs } = module
    const inputs = module.params.concat(module.inputs)
    const { refreshProbes } = useContext(SizeConstraintContext)
    const maxPorts = Math.max(inputs.length, outputs.length)

    useEffect(() => {
        // Adding/removing variadic ports should trigger Probes
        // to reestimate space they occupy.
        refreshProbes()
    }, [maxPorts, refreshProbes])

    const { isDragging, data } = useContext(DragDropContext)
    const { portId } = data || {}
    const dragInProgress = !!(isDragging && portId != null)
    const isDisabled = !!(disabled || dragInProgress)

    return !!(inputs.length || outputs.length) && (
        <div className={cx(styles.root, className)}>
            <div className={styles.ports}>
                <Probe uid="inputs" width="auto" group="Ports" />
                {inputs.map((port) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        disabled={isDisabled}
                        key={port.id}
                        onPort={onPort}
                        onValueChange={onValueChange}
                        onSizeChange={refreshProbes}
                        port={port}
                        setOptions={api.port.setPortOptions}
                    />
                ))}
            </div>
            <div className={styles.gutter}>
                <Probe uid="gutter" width="auto" group="Ports" />
            </div>
            <div className={styles.ports}>
                <Probe uid="outputs" width="auto" group="Ports" />
                {outputs.map((port) => (
                    <Port
                        api={api}
                        canvas={canvas}
                        disabled={isDisabled}
                        key={port.id}
                        onPort={onPort}
                        onValueChange={onValueChange}
                        onSizeChange={refreshProbes}
                        port={port}
                        setOptions={api.port.setPortOptions}
                    />
                ))}
            </div>
        </div>
    )
}

export default Ports
