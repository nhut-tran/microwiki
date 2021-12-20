import React, {useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import Icon from '../../img/spinner6.svg'
import  fetchData from '../../utils/fetchData'

function UserAccount() {
    const [user, setUser] = useState()
    const [photo, setPhoto] = useState()
    const [displaySetting, setDisplaySetting] = useState()
    const [fetching, setFetching] = useState(true)
    useEffect(() => {
        fetchData('get', '/user/me').then(res => {
            if(res.status==='success') {
                setUser(res.data)
                setFetching(false)
                setDisplaySetting(false)
            } 
        })
    }, [])
    const handleSubmit = (e) => {
        const formData = new FormData()
        formData.append('avatar', photo)
        formData.append('data', user)
        e.preventDefault()
        fetchData('patch', '/user/updateInfo', formData).then(res => {
            setUser(res)
            setFetching(false)
        })
    }
    if(!fetching) {
        if(!displaySetting) {
            return (
                <div className='leftpanel'>
                    <div className='leftpanel__header leftpanel__header--account'>
                        <div><img className='image--avatar' src={`./img/${user.photo}`} onError = {(e) => e.target.src='/img/avatar.jpeg'}/></div>
                        <h3 className='header-tertinary'>Account Name: {user.name}</h3>         
                    </div>
                    <div className='leftpanel__body leftpanel__body--account'>
                    <h3 className='header-tertinary'>Your Email: {user.email}</h3>
                        
                    </div>
                    {(!displaySetting) && <div className='leftpanel__footer leftpanel__footer--account'>
                            <a className='btn btn-action' onClick={(e) => {
                                e.preventDefault()
                                setDisplaySetting(true)
                            }}> Setting Account</a>
                    </div>}
                </div>
            
        )

        } else {
            return (
                <form className='form form--account'>
                    <div className='form__form-group'>
                        <h3 className='header-tertinary'>Change Your Avatar</h3>
                        <input type='file' name='avatar' onChange = {(e) => setPhoto(e.target.files[0])}/>
                    </div>
                    <div className='form__form-group'>
                        <h3 className='header-tertinary'>Change Your Password</h3>
                        <Link className = 'btn btn-shuttle--right' to='/user/changePassword'>Change Your Password here</Link>
                    </div>
                    <div className='form__box'>
                        <a className='btn btn-action' onClick={(e) => {
                            setFetching(true)
                            setDisplaySetting(false)
                            handleSubmit(e)
                        }}> SAVE </a>
                    </div>
                </form>
            )
        }
        
    } else {
        return (
            <div className='leftpanel'>
                <div className='leftpanel__item leftpanel__item--spinner'>
                    <Icon className='icon--spinner'/>
                    <div className='header-tertinary'>Please wait...</div>
                </div>
            </div>
        )
    }
}


export default UserAccount