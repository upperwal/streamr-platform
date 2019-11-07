// @flow

import React, { useMemo, useContext } from 'react'
import cx from 'classnames'

import useEditableProduct from '../ProductController/useEditableProduct'
import useValidation from '../ProductController/useValidation'
import useEditableProductActions from '../ProductController/useEditableProductActions'
import { usePending } from '$shared/hooks/usePending'
import SelectField from '$mp/components/SelectField'
import { isCommunityProduct } from '$mp/utils/product'
import { Context as ValidationContext } from '../ProductController/ValidationContextProvider'

import AvailableCategories from '../AvailableCategories'
import Details from './Details'

import styles from './productDetails.pcss'

const adminFeeOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90].map((value) => ({
    label: `${value} %`,
    value: `${value / 100}`,
}))

const ProductDetails = () => {
    const product = useEditableProduct()
    const { isTouched } = useContext(ValidationContext)

    const { isValid: isCategoryValid, message: categoryMessage } = useValidation('category')
    const { isValid: isAdminFeeValid, message: adminFeeMessage } = useValidation('adminFee')
    const { updateCategory, updateAdminFee } = useEditableProductActions()
    const { isPending } = usePending('product.SAVE')

    const adminFee = product && product.adminFee
    const selectedAdminFee = useMemo(() => adminFeeOptions.find(({ value }) => value === adminFee), [adminFee])

    return (
        <section id="details" className={cx(styles.root, styles.ProductDetails)}>
            <div>
                <h1>Give us some more details</h1>
                <Details>
                    <Details.Row label="Choose a product category">
                        <AvailableCategories>
                            {({ fetching, categories }) => {
                                const opts = (categories || []).map((c) => ({
                                    label: c.name,
                                    value: c.id,
                                }))
                                const selected = opts.find((o) => o.value === product.category)

                                return !fetching ? (
                                    <SelectField
                                        name="name"
                                        options={opts}
                                        value={selected}
                                        onChange={(option) => updateCategory(option.value)}
                                        isSearchable={false}
                                        error={isTouched('category') && !isCategoryValid ? categoryMessage : undefined}
                                        disabled={!!isPending}
                                    />
                                ) : null
                            }}
                        </AvailableCategories>
                    </Details.Row>
                    {isCommunityProduct(product) && (
                        <Details.Row label="Set your admin fee" className={styles.adminFee}>
                            <SelectField
                                name="adminFee"
                                options={adminFeeOptions}
                                value={selectedAdminFee}
                                onChange={(option) => updateAdminFee(option.value)}
                                isSearchable={false}
                                error={isTouched('adminFee') && !isAdminFeeValid ? adminFeeMessage : undefined}
                                disabled={!!isPending}
                            />
                        </Details.Row>
                    )}
                </Details>
            </div>
        </section>
    )
}

export default ProductDetails