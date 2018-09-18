// @flow

import { connect } from 'react-redux'

import { selectDataPerUsd } from '../../../../modules/global/selectors'
import SetPriceDialog from '../../../../components/Modal/SetPriceDialog/index'
import withContractProduct from '../../../WithContractProduct/index'

const mapStateToProps = (state) => ({
    dataPerUsd: selectDataPerUsd(state),
})

export default connect(mapStateToProps)(withContractProduct(SetPriceDialog))
