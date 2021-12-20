import React from 'react'
import {Link} from 'react-router-dom'
const listItem = ({filter, page, id, setStyle}) => {
    return (
        <Link onClick={setStyle()}></Link>
    )
}