import React from 'react'

const Card = ({ cardStyle, children }) => {
    // Styles
    const container = " border-2 border-white rounded-xl"

    return (
        <div className={`${container} ${cardStyle}`}>
            {children}
        </div>
    )
}

export default Card
