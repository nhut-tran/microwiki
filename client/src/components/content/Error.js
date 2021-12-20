import React from 'react'
import {Link} from 'react-router-dom'
const ErrorNotif = (props) => {
    return (
     
        <div className='error-notification'>
            <Link to ={props.to ? props.to: ''} 
                onClick = {props.action ? props.action : null}>
                {props.message}
            </Link>
        </div>
    )
}

export default ErrorNotif