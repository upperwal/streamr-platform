import React from 'react'
import { withRouter } from 'react-router-dom'

import Canvas from './Canvas'
import SubCanvas from './SubCanvas'

export default withRouter((props) => {
    const { id: canvasId, '0': subCanvasId } = props.match.params

    return subCanvasId ?
        <SubCanvas parentCanvasId={canvasId} canvasId={`${canvasId}/${subCanvasId}`} /> :
        <Canvas canvasId={canvasId} />
})
