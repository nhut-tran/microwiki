import React, { useState } from 'react'
import {connect} from 'react-redux'
import {updatePassword} from '../../store/action/userAction'
import {useHistory} from 'react-router-dom'
import {userFormHook} from '../../utils/checkInput'
import FormGroup from '../content/FormGroup'


function Login(props) {
    const [oldPassword, setoldPassword] = useState()
    const [password, setPassword] = useState()
    const [passwordConfirm, setPasswordConfirm] = useState()
    const history = useHistory()
    const [state, dispatch] = userFormHook({
        err: [],
        data: {
            passwordOld: '',
            password: '',
            passwordConfirm: ''
        }})
    function handleSubmit(e) {
        e.preventDefault()
        props.dispatch(updatePassword({oldPassword,
            password, passwordConfirm}, history))
    }
        return (
            <form className='form' onSubmit = {(e) => handleSubmit(e)}>
               {}
                <div className='form__box'>
                    <a className='btn btn-action'
                        onClick={(e) => {
                        handleSubmit(e)
                        }}>Save
                    </a>
                </div>
            </form>
        )
    
}
const mapStateToProps = (state) => {
    return {
        error: state.user.error
    }
}

export default connect(mapStateToProps)(Login)

// {props.error && <div className='error-notification'>{props.error}</div>}
//                <div className='form__form-group'>
//                     <h3 className='header-secondary' for="oldPassword">Your current password</h3>
//                     <input onChange = {(e) => {setoldPassword(e.target.value)}} placeholder = {'Your current Password'} type='password' name ='name'/>
//                 </div>
//                 <div className='form__form-group'>
//                     <h3 className='header-secondary' for="Password">Password</h3>
//                     <input onChange = {(e) => {setPassword((e.target.value))}} placeholder = {'Type your new password'} type='password' name='type'/>
//                </div>
//                <div className='form__form-group'>
//                     <h3 className='header-secondary' for="PasswordConfirm">Password Confirm</h3>
//                     <input onChange = {(e) => {setPasswordConfirm((e.target.value))}} placeholder = {'Confirm your new password'} type='password' name='type'/>
//                </div>}