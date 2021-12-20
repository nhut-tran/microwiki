import React, { useState, useMemo } from 'react'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import { connect } from 'react-redux'
import { signup, checkStatus, updatePassword, login } from '../../store/action/userAction'
import Loading from '../../utils/Loading'
import { userFormHook } from '../../utils/checkInput'
import FormGroup from '../content/FormGroup'


function Signup(props) {
    const [loading, setLoading] = useState()
    const history = useHistory()
    const path = useRouteMatch().path

    const finalSubmit = (e) => {
        dispatch({ type: 'RE_CHECK_EMPTY' })
        if (state.err.length === 0) {
            setLoading('loading')
            handleSubmit(e)
        }
    }
    const setCon = () => {
        let initialState
        let handleSubmit

        if (useRouteMatch('/user/newSignup')) {
            initialState = {
                err: [],
                title: 'Sign Up',
                data: {
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirm: ''
                },
                type: {
                    name: 'text',
                    email: 'text',
                    password: 'password',
                    passwordConfirm: 'password'
                },
                validator: {
                    name: 'empty',
                    email: 'email',
                    password: 'password',
                    passwordConfirm: 'passwordConfirm'
                }
            }
            handleSubmit = (e) => {
                e.preventDefault()
                props.dispatch(signup(state.data, setLoading))
            }
        } else if (useRouteMatch('/user/changePassword')) {
            initialState = {
                err: [],
                title: 'Change Password',
                data: {
                    passwordOld: '',
                    password: '',
                    passwordConfirm: ''
                },
                type: {
                    passwordOld: 'password',
                    password: 'password',
                    passwordConfirm: 'password'
                },
                validator: {
                    passwordOld: 'empty',
                    password: 'password',
                    passwordConfirm: 'passwordConfirm'
                }
            }
            handleSubmit = (e) => {
                e.preventDefault()
                props.dispatch(updatePassword(state.data, history, setLoading))
            }

        } else if (useRouteMatch('/user/login')) {
            initialState = {

                err: [],
                title: 'Log In',
                data: {
                    email: '',
                    password: ''
                },
                type: {
                    email: 'text',
                    password: 'password'
                },
                validator: {
                    email: 'email',
                    password: 'empty'
                }
            }
            handleSubmit = (e) => {
                e.preventDefault()
                props.dispatch(login(state.data, history))
            }

        }
        return [initialState, handleSubmit]
    }
    const [initialState, handleSubmit] = useMemo(setCon, [path])
    const [state, dispatch] = userFormHook(initialState)
    const findErr = (err, name) => {
        if (err.length > 0) {
            const foundErr = err.find((el) => {
                if (name === el.type) {
                    return el
                }
            })
            if (foundErr) return foundErr.value
        }
    }

    const stateReady = (state) => {
        const empty = []
        Object.keys(state.data).map(el => { if (state.data[el].length === 0) { empty.push(el) } })
        if (empty.length === 0 && state.err.length === 0) {
            return true
        }
        return false
    }
    const handler = (act, value) => {
        dispatch({ type: 'CHECK', act, value })

    }
    if (loading === 'success') {

        return (
            <div className='notification'>
                <div className='error-notification'>Đăng ký thành công. Kiểm tra email để kích hoạt tài khoản</div>
                <Link className='notification__link' to='/' onClick={() => props.dispatch(checkStatus())} >Quay lai Trang chu</Link>
            </div>
        )
    }
    else {
        return (
            <form className='form form--user' >
                <h1 className='header-secondary'>{state.title}</h1>
                {props.error.message && <div className='form__box'><div className='error-notification error-notification--form'>{props.error.message}</div></div>}
                {Object.keys(state.data).map((el) => {
                    return <FormGroup val={props.error.message ? state.data[el] : undefined} finalSubmit={finalSubmit} name={el} handler={handler} err={findErr(state.err, el)}
                        type={state.type[el]}
                    />
                })}
                {loading !== 'loading' ? <div className='form__box' style={{ 'flex-direction': 'row', 'justify-content': 'center' }}>
                    <Link className={stateReady(state) ? 'btn btn-action' : 'btn btn-action--disable'}
                        onClick={(e) => {
                            finalSubmit(e)
                        }}


                    >{state.title}
                    </Link>
                    {state.title === 'Log In' && <Link to='/user/newSignup' style={{ 'margin-left': '1rem' }} className='btn btn-shuttle--right' >Tạo tài khoản mới <span>&#8594;</span></Link>
                    }
                </div> : <Loading />}
            </form>
        )

    }
}
const mapStateToProps = (state) => {
    return {
        error: state.user.error,
        userName: state.user.userInfo
    }
}
export default connect(mapStateToProps)(Signup)
