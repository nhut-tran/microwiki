import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import fetchData from '../utils/fetchData'
function AddMin() {
    const [method, setMethod] = useState()
    const [media, setMedia] = useState()
    const [user, setUser] = useState()
    useEffect(() => {
        fetchData('get', '/methods/getStat').then(data => {setMethod(data.data)})
        
    }, [])
    useEffect(() => {
        fetchData('get', '/media/getStat').then(data => {setMedia(data.data)})
    }, [])
    // useEffect(async() => {
    //     const data = await fetchData('get', '/user/getStat')
    //     setUser(data)
    // }, [])
    return (
        <div className='admin'>
           <div className='admin-box'>
            <h1 className='header-secondary'>Method</h1>
            <h3 className='header-tertinary'>Total number of Methods <span>{method >= 0 ? method : 'loading...'}</span></h3>
            <Link to = '/edit/methods' className='btn btn-shuttle--right'>Go to  <span>&#8594;</span></Link>
            <Link to = '/addnew/methods' className='btn btn-shuttle--right'>Add New  <span>&#8594;</span></Link>
           </div>
           <div className='admin-box'>
            <h1 className='header-secondary'>Media</h1>
            <h3 className='header-tertinary'>Total number of Media <span>{media >= 0 ? media : 'loading...'}</span></h3>
            <Link to = '/edit/media' className='btn btn-shuttle--right'>Go to  <span>&#8594;</span></Link>
            <Link to = '/addnew/media' className='btn btn-shuttle--right'>Add New  <span>&#8594;</span></Link>
           </div>
           <div className='admin-box'>
            <h1 className='header-secondary'>User</h1>
            <h3 className='header-tertinary'>Total number of User <span>{user}</span></h3>
            <Link to = '/' className='btn btn-shuttle--right'>Go to  <span>&#8594;</span></Link>
           </div>
        </div>
    )
}

export default connect()(AddMin)