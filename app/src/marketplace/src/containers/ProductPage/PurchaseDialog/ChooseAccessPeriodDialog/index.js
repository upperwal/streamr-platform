// @flow

import { connect } from 'react-redux'

import { selectDataPerUsd } from '../../../../modules/global/selectors'
import ChooseAccessPeriodDialog from '../../../../components/Modal/ChooseAccessPeriodDialog/index'

const mapStateToProps = (state) => ({
    dataPerUsd: selectDataPerUsd(state),
})

export default connect(mapStateToProps)(ChooseAccessPeriodDialog)
