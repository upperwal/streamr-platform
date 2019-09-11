import React, { useState, useCallback, useEffect } from 'react'
import cx from 'classnames'

import Spinner from '$shared/components/Spinner'
import useIsMounted from '$shared/hooks/useIsMounted'
import useCopy from '$shared/hooks/useCopy'

import CodeEditor from '$editor/canvas/components/CodeEditor'

import ModuleSubscription from '../ModuleSubscription'
import styles from './Solidity.pcss'

export default function SolidityModule(props) {
    const {
        api,
        moduleHash,
        module,
        isActive,
        className,
    } = props

    const { pushNewDefinition, updateModule } = api

    const isMounted = useIsMounted()
    const [debugMessages, setDebugMessages] = useState([])
    const [isDeploying, setIsDeploying] = useState(false)

    const onApply = useCallback(async (code) => (
        pushNewDefinition(moduleHash, {
            code,
            compile: true,
        })
    ), [pushNewDefinition, moduleHash])

    const onChange = useCallback((code) => {
        updateModule(moduleHash, { code })
    }, [updateModule, moduleHash])

    const onDeploy = useCallback(() => {
        if (isDeploying) { return }
        setIsDeploying(true)
    }, [setIsDeploying, isDeploying])

    useEffect(() => {
        if (!isDeploying) { return }
        pushNewDefinition(moduleHash, {
            deploy: true,
        }).finally(() => {
            if (!isMounted()) { return }
            setIsDeploying(false)
        })
    }, [isDeploying, moduleHash, isMounted, pushNewDefinition, setIsDeploying])

    const onMessage = useCallback((d) => {
        if (d.type === 'debug') {
            setDebugMessages((debugMessages) => (
                debugMessages.concat(d)
            ))
        }
    }, [setDebugMessages])

    const onClearDebug = useCallback(() => {
        setDebugMessages([])
    }, [setDebugMessages])

    const { isCopied, copy } = useCopy()
    const { contract } = module
    const abi = contract && contract.abi

    const copyABI = useCallback(() => {
        if (!abi) { return }
        copy(JSON.stringify(abi))
    }, [abi, copy])

    return (
        <div className={cx(styles.SolidityModule, className)}>
            <ModuleSubscription
                {...props}
                onMessage={onMessage}
            />
            <CodeEditor
                code={module.code || ''}
                readOnly={isActive}
                onApply={onApply}
                onChange={onChange}
                debugMessages={debugMessages}
                onClearDebug={onClearDebug}
            >
                {(openEditor) => (
                    <div className={styles.buttonsContainer}>
                        <button
                            type="button"
                            className={styles.button}
                            onClick={openEditor}
                        >
                            Edit code
                        </button>
                        <button
                            type="button"
                            className={styles.button}
                            onClick={copyABI}
                            disabled={!abi || isCopied}
                        >
                            {isCopied ? 'Copied' : 'Copy ABI'}
                        </button>
                        <button
                            type="button"
                            className={cx(styles.button, styles.primary)}
                            onClick={onDeploy}
                            disabled={contract && (contract.address || isDeploying)}
                        >
                            {(!contract || (contract && !contract.address)) && !isDeploying && (
                                'Deploy'
                            )}
                            {(!contract || (contract && !contract.address)) && isDeploying && (
                                <Spinner size="small" className={styles.spinner} />
                            )}
                            {contract && contract.address && (
                                'Deployed'
                            )}
                        </button>
                    </div>
                )}
            </CodeEditor>
            {contract && contract.address && (
                <div>
                    <div className={styles.address}>
                        <div className={styles.addressLabel}>Address</div>
                        <div
                            className={styles.addressValue}
                            data-truncated={contract.address.substring(contract.address.length - 6)}
                            title={contract.address}
                        >
                            <div>{contract.address}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
