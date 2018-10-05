// @flow

import { post } from '$mp/utils/api'
import { formatApiUrl } from '$mp/utils/url'
import { getContract, send } from '$mp/utils/smartContract'
import getConfig from '$mp/web3/config'
import type { ApiResult } from '$mp/flowtype/common-types'
import type { ProductId, Product } from '$mp/flowtype/product-types'
import type { SmartContractTransaction, Hash } from '$mp/flowtype/web3-types'
import { gasLimits } from '$mp/utils/constants'
import { getValidId, mapProductFromApi } from '$mp/utils/product'

export const postUndeployFree = async (id: ProductId): ApiResult<Product> => post(formatApiUrl('products', getValidId(id, false), 'undeployFree'))
    .then(mapProductFromApi)

export const postSetUndeploying = async (id: ProductId, txHash: Hash): ApiResult<Product> => (
    post(formatApiUrl('products', getValidId(id, false), 'setUndeploying'), {
        transactionHash: txHash,
    }).then(mapProductFromApi)
)

const contractMethods = () => getContract(getConfig().marketplace).methods

export const deleteProduct = (id: ProductId): SmartContractTransaction => (
    send(contractMethods().deleteProduct(getValidId(id)), {
        gas: gasLimits.DELETE_PRODUCT,
    })
)
