import React from 'react'
import {Link} from 'react-router-dom'
 const NotFound = () => {
    return (
        <div className='notification'>
            <h2 className='error-notification'>404 - NOT FOUND</h2>
            <Link className='notification__link' to='/'>Trang chu</Link>
        </div>
        
    )
}

export default NotFound