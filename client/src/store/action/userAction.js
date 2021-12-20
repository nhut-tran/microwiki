import fetchData from '../../utils/fetchData'

export const signup = (userInfo, setLoading) => {
    return (dispatch) => {
        fetchData('post', '/user/signup', userInfo).then((res) => {
            if (res.status === 'success') {
                dispatch({
                    type: 'SIGNUP_SUCCESS',
                    user: {
                        isLogined: true,
                        userStatus: res.signupStatus,
                        userInfo: res.userName,
                        userRole: res.userRole,
                        photo: res.userPhoto,
                        error: { message: null }
                    }
                })
                setLoading('success')
            } else if (res.status === 'fail') {
                dispatch({
                    type: 'SIGNUP_FAIL',
                    user: {
                        isLogined: false,
                        userInfo: null,
                        userStatus: undefined,
                        userRole: null,
                        error: { message: res.message }
                    }
                })
                setLoading()
            }
        })
    }

}


export const login = (userInfo, history) => {

    return (dispatch) => {
        fetchData('post', '/user/login', userInfo).then((res) => {
            console.log(res)
            if (res.status === 'success') {

                dispatch({
                    type: 'LOG_IN_SUCCESS',
                    user: {
                        isLogined: true,
                        userInfo: res.userName,
                        userStatus: res.signupStatus,
                        userRole: res.userRole,
                        photo: res.userPhoto,
                        error: { message: null }
                    }
                })
                history.push('/')
            } else if (res.status === 'fail') {
                dispatch({
                    type: 'LOG_IN_FAIL',
                    user: {
                        isLogined: false,
                        userInfo: null,
                        userStatus: undefined,
                        userRole: null,
                        photo: null,
                        error: { message: res.message }
                    }
                })
            }
        })
    }

}
export const logout = () => {
    return (dispatch) => {
        fetchData('post', '/user/logout', '').then((res) => {
            if (res.status === 'success') {
                dispatch({
                    type: 'LOG_OUT_SUCCESS',
                    user: {
                        isLogined: false,
                        userInfo: res.userName,
                        userRole: res.userRole,
                        userStatus: undefined,
                        photo: null,
                        error: { message: null }
                    }
                })
            }
        })
    }

}
export const updatePassword = (userInfo, history, setLoading) => {
    return (dispatch) => {
        fetchData('patch', '/user/updatePassword', userInfo).then((res) => {
            if (res.status === 'success') {
                dispatch({
                    type: 'LOG_OUT_SUCCESS',
                    user: {
                        isLogined: false,
                        userInfo: null,
                        userRole: null,
                        userStatus: undefined,
                        photo: null,
                        error: { message: null }
                    }
                })
                setLoading('success')
                alert('Change Password Success. Login With your new password')
                history.push('/user/login')
            } else if (res.status === 'fail') {
                dispatch({
                    type: 'UPDATE_PASSWORD_FAIL',
                    user: {
                        error: { message: res.message }
                    }
                })
                setLoading()
            }
        })
    }

}
export const clearErr = () => {
    return {
        type: 'CLEAR_ERR'
    }
}
export const checkStatus = (setCheckUser) => {

    return (dispatch) => {

        fetchData('get', '/user/rememberUser').then((res) => {
            if (res.status === 'success') {
                dispatch({
                    type: 'LOG_IN_SUCCESS',
                    user: {
                        isLogined: true,
                        userInfo: res.userName,
                        userStatus: res.signupStatus,
                        photo: res.userPhoto,
                        userRole: res.userRole
                    }
                })
            }
            else if (res.status === 'fail') {
                dispatch({
                    type: 'LOG_IN_FAIL',
                    user: {
                        isLogined: false,
                        userStatus: undefined,
                        userInfo: null,
                        photo: null,
                        userRole: null
                    }
                })
            }

            setCheckUser(true)

        })
    }

}

