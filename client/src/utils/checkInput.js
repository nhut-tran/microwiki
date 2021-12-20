import isEmail from 'validator/lib/isEmail'
import { useReducer } from 'react'

const checkValidStringNumber = (num = [], str = [], data, position) => {

    let numErr = [], strErr = []
    if (!position) {
        num.forEach(el => {
            if (isNaN(data[el]) || data[el] == 0) {
                numErr.push(el)
            }
        })
        str.forEach(el => {

            if (data[el].length === 0) {
                strErr.push(el)
            }
        })


    } else {
        num.forEach(el => {

            if (isNaN(data[el]) || data[el] == 0) {
                const err = el + '-' + position
                numErr.push(err)
            }
        })

        str.forEach(el => {

            if (data[el].length === 0) {
                const err = el + '-' + position

                strErr.push(err)
            }
        })
    }

    if (numErr.length > 0 || strErr.length > 0) {
        return [...numErr, ...strErr]
    } else {
        return []
    }

}

const isEmpty = (val) => {
    if (val.length < 1) {
        return 'This info is required'
    }
}
const checkValidNum = (val) => {
    if (isNaN(val)) {
        return 'Must be a Number'
    }
}
const checkValidEmail = (val) => {
    if (!isEmail(val)) {
        return 'Invalid email'
    }
}

const checkValidPassword = (pass) => {
    if (pass.length < 8) {
        return 'Password must be > 8 characters'
    }
}
const checkValidPassConfirm = (pass, passConfirm) => {
    if (pass !== passConfirm) {
        return 'Password and password confirm not match'
    }
}
const validators = {
    password: checkValidPassword,
    email: checkValidEmail,
    num: checkValidNum,
    passwordConfirm: checkValidPassConfirm,
    empty: isEmpty,
}

// loop through all prop check if prop implement empty checker => issue err if any
const checkNotEmpty = (next) => {
    Object.keys(next.data).forEach(el => {

        if (next.data[el].length === 0 && next.validator[el] === 'empty') {
            next.err = next.err.concat({ type: el, value: 'This info is required' })
            console.log(next.err, { type: el, value: 'This info is required' })
        }

    })

    return next
}

export function userFormHook(initialState) {
    function reducer(state, action) {
        switch (action.type) {
            case 'CHECK':
                let validateRes
                if (action.act === 'passwordConfirm') {
                    validateRes = validators[state.validator[action.act]](state.data.password, action.value)
                }
                else {
                    //check input value is valid
                    validateRes = validators[state.validator[action.act]](action.value)

                }
                //check if err already exist
                const index = state.err.findIndex(err => err.type === action.act)
                //if not valid
                if (validateRes) {
                    //and err not exist
                    if (index < 0) {
                        const error = {}
                        error.type = action.act
                        error.value = validateRes
                        const err = state.err.concat(error)
                        return checkNotEmpty({ ...state, err })
                    } else {
                        return state
                    }
                    //err exist && valid input => delete err
                } else {
                    const next = { ...state }
                    next.err = [...state.err.slice(0, index), ...state.err.slice(index + 1)]
                    next.data[action.act] = action.value
                    return checkNotEmpty(next)
                }
            default:
                return state
        }
    }
    return useReducer(reducer, initialState
    )
}

export default checkValidStringNumber
