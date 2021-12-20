import React, { useState } from 'react'
import {connect} from 'react-redux'
import {login} from '../../store/action/userAction'
import {useHistory, Link} from 'react-router-dom'
function Login(props) {
    const [email, setEmail] = useState('Email')
    const [password, setPassword] = useState('password')
    const history = useHistory()
    function handleSubmit(e) {
        e.preventDefault()
        props.dispatch(login({email,
            password}, history))
    }
        return (
            <form className='form' onSubmit = {(e) => handleSubmit(e)}>
               {props.error && <div className='error-notification'>{props.error}</div>}
               <div className='form__form-group'>
                    <h3 className='header-secondary' for="Email">Email</h3>
                    <input onChange = {(e) => {setEmail(e.target.value)}} placeholder = {email} type='text' name ='name'/>
                </div>
                <div className='form__form-group'>
                    <h3 className='header-secondary' for="Password">Password</h3>
                    <input onChange = {(e) => {setPassword((e.target.value))}} placeholder = {password} type='password' name='type'/>
               </div>
                <div className='form__box'>
                    <Link className='btn btn-shuttle' to='/user/newSignup'>Not have Account yet. Sign up here</Link> <br/>
                    <Link className='btn btn-action'
                        onClick={(e) => {
                        handleSubmit(e)
                        }}>Log In
                    </Link>
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