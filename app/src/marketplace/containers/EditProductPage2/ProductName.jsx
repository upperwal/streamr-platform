// @flow

import React from 'react'
import cx from 'classnames'
import ScrollableAnchor from 'react-scrollable-anchor'

import TextControl from '$shared/components/TextControl'

import useProduct from '../ProductController/useProduct'
import useValidation from '../ProductController/useValidation'
import useProductActions from '../ProductController/useProductActions'

import styles from './productName.pcss'

const ProductName = () => {
    const product = useProduct()
    const { isValid, level, message } = useValidation('name')
    const { updateName } = useProductActions()

    return (
        <ScrollableAnchor id="product-name">
            <div className={cx(styles.root, styles.ProductName)}>
                <h1>Name your product</h1>
                <TextControl
                    immediateCommit={false}
                    commitEmpty
                    onCommit={(value) => updateName(value)}
                    value={product.name}
                    placeholder="Product Name"
                    className={styles.input}
                />
                {!isValid && (
                    <p>{level}: {message}</p>
                )}
            </div>
        </ScrollableAnchor>
    )
}

export default ProductName
