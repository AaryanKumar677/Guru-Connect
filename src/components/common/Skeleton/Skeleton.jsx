import React from 'react'
import './Skeleton.css'

const Skeleton = ({ width, height, borderRadius, variant = 'text', className = '', style = {} }) => {
    const computedStyle = {
        width,
        height,
        borderRadius,
        ...style
    }

    return (
        <div
            className={`skeleton skeleton-${variant} ${className}`}
            style={computedStyle}
        />
    )
}

export default Skeleton
