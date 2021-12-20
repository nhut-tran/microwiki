//Form group with validate information
import React, { useState } from 'react'
import Eye from '../../img/eye.svg'
import EyeBlock from '../../img/eye-blocked.svg'
function FormGroup({ handler, name, err, type, finalSubmit, val }) {

    const [timer, setTimer] = useState(null)
    // const [timerHidePass, setTimerHidePass] = useState(null)
    const [eye, setEye] = useState(true)
    // const [hidePass, sethidePass] = useState('')
    // const hidePassword = (val) => {
    //    sethidePass((prev) => {
    //        const next = prev.slice(0, prev.length - 1)
    //         return next + '*'
    //    })

    // }
    const translate = (key) => {
        const dic = {
            email: 'Email',
            name: 'Tên',
            password: 'Mật khẩu',
            passwordConfirm: 'Nhập lại mật khẩu'

        }
        return dic[key]
    }

    const delay = (fn, act, value) => {
        clearTimeout(timer)
        const callFn = fn.bind(null, act, value)
        // if(name.includes('password')) {
        //   //  clearTimeout(timerHidePass)
        //  //   sethidePass((prev) => prev + value[value.length - 1])
        //   //  const callHidePass = hidePassword.bind(null, value)
        //    setTimerHidePass(setTimeout(callHidePass, 200))
        // }
        setTimer(setTimeout(callFn, 500))
    }
    return (
        <div className='form__form-container'>
            {err && <div className='form__box'><div className='error-notification'>{err}</div></div>}
            <div className='form__form-group'>
                <h2 className='header-tertinary' for={name}>{translate(name)}</h2>
                <input onChange={(e) => { delay(handler, name, e.target.value); }}
                    placeholder={val ? val : translate(name)} type={type === 'password' ? (eye ? type : 'text') : type} name={name}
                    onKeyPress={(e) => {

                        if (e.key === 'Enter') {
                            finalSubmit(e)
                        }

                    }}
                />
                {type.includes('password') ? <span className='form__form-group__password-eye' onClick={() => setEye(!eye)}>
                    {eye ? <Eye className='icon--eye' /> : <EyeBlock className='icon--eye-blocked' />}</span> : null}
            </div>
        </div>


    )
}

export default FormGroup