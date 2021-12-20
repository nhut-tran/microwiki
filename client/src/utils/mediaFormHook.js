import {useReducer} from 'react'


function mediaFormHook() {
    function reducer(state, action) {
        switch(action.type) {
            case 'SET_INITIAL':
                return action.state
            case 'SET_DATA':
                return {...state, ...action.data}
            default:
                return state
        }
    }
    return useReducer(reducer, {
        name: '',
        typeByUse: '',
        typeByPhysical: '',
        description: '',
        GamPerLitter: 0
    })
}

export default mediaFormHook