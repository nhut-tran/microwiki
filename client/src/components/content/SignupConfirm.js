import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import fetchData from '../../utils/fetchData'
import { checkStatus } from '../../store/action/userAction'
import Icon from '../../img/spinner6.svg'
import { useParams, Link } from 'react-router-dom'

function SignupConfirm(props) {
    const { token } = useParams()
    const initialComp = (
        <div className='spinner'>
            <Icon className='icon--spinner' />
            <div className='header-tertinary'>Please wait...</div>
        </div>
    )
    const [resultComp, setResultComp] = useState(initialComp)
    useEffect(() => {
        fetchData('get', `/user/activate/${token}`).then((res) => {
            if (res.status === 'success') {
                setResultComp(<div className='notification'>
                    <div className='error-notification'>Kích hoạt tài khoản thành công</div>
                    <Link className='notification__link' to='/' onClick={() => props.dispatch(checkStatus())} >Quay lai Trang chu</Link>
                </div>

                )
            } else {
                setResultComp(<div className='notification'>
                    <div className='error-notification'>Tài khoản của bạn đã được kích hoạt hoặc đã quá thời hạn kích hoạt tài khoản</div>
                    <div className='error-notification'>Vui lòng liên hệ để được hướng dẫn</div>
                    <Link className='notification__link' to='/' onClick={() => props.dispatch(checkStatus())} >Quay lai Trang chu</Link>
                </div>)

            }
        })
    }, [])
    return resultComp
}

export default connect()(SignupConfirm)