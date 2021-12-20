import React from 'react'
import Icon from '../img/spinner6.svg'
function Loading() {
    return (
        <div className='spinner'>
            <Icon className='icon--spinner'/>
            <div className='header-tertinary'>Please wait...</div>
        </div>
    )
}

export default Loading