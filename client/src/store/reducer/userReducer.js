import { clearErr } from "../action/userAction"

const userDefaultState = { isLogined: false, userRole: undefined, userInfo: 'Dang Nhap', userStatus: false, error: { message: null } }

const userReducer = (state = userDefaultState, action = { type: 'default' }) => {
    switch (action.type) {
        case 'LOG_IN_SUCCESS':
        case 'LOG_OUT_SUCCESS':
            return { ...state, ...action.user }
        case 'SIGNUP_SUCCESS':
        case 'UPDATE_PASSWORD_SUCCESS':
            return state
        //     return {...state, ...action.user}
        case 'LOG_IN_FAIL':
        case 'SIGNUP_FAIL':
        case 'UPDATE_PASSWORD_FAIL':
            return { ...state, ...action.user }
        case 'LOG_OUT':
            return { ...state, ...action.user }
        case 'CLEAR_ERR':
            const error = { message: null }
            return { ...state, error }
        case 'default':
        default:

            return state
    }

}

export default userReducer