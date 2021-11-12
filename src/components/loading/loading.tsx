import React from 'react'

import './styles.scss'

type TLoadingProps = {
    color?: string
}

const Loading: React.FC<TLoadingProps> = ({ color = '' }) => {
    color = color || '#348ccc'
    return (
        <div className='custom-loading'>
            <div className='lds-ripple'>
                <div style={{ borderColor: color }}/>
                <div style={{ borderColor: color }}/>
            </div>
        </div>
    )
}

export default Loading