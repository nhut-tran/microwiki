import { combineReducers } from 'redux'
const createList = (filter) => {
    return (state = {}, action) => {
        if (action.filter !== filter) {
            return state
        }
        switch (action.type) {
            case 'FETCHING_DATA_SUCCESS':
                const nextState = { ...state }
                action.response.data.forEach(method => {
                    nextState[method._id] = method
                })
                return nextState
            case 'POSTING_DATA_SUCCESS':
                const data = {}
                if (action.newData) {
                    data[action.newData.data._id] = action.newData.data
                    return {
                        ...state,
                        ...data
                    }
                }
                return state

            case 'DELETING_DATA_SUCCESS':
                const omit = (prop, { [prop]: _, ...rest }) => rest
                const d = omit(action.id, state)
                return d
            default:
                return state
        }

    }
}
const list = combineReducers({
    methods: createList('methods'),
    media: createList('media'),
    data: createList('data')
})

export default list