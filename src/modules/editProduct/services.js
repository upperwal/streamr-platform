// @flow

import { put } from '../../utils/api'
import { formatUrl } from '../../utils/url'
import type { ApiResult } from '../../flowtype/common-types'
import type { EditProduct, Product, ProductId } from '../../flowtype/product-types'

export const putProduct = (data: EditProduct, id: ProductId): ApiResult<Product> => put(formatUrl('products', id), data)