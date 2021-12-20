import { combineReducers } from 'redux'
const createIdList = (filter) => {

    const ids = (state = [], action) => {
        if (action.filter !== filter) {
            return state
        }
        switch (action.type) {
            case 'FETCHING_DATA_SUCCESS':
                return action.response.data.map(el => el._id)
            case 'POSTING_DATA_SUCCESS':
            case 'UDATING_DATA_SUCCESS':
                if (action.newData) {
                    return [...state, action.newData.data._id]
                } else {
                    return state
                }

            case 'DELETING_DATA_SUCCESS':
                const index = state.findIndex(el => el === action.id)
                return [...state.slice(0, index), ...state.slice(index + 1)]
            default:
                return state
        }

    }
    const isFetching = (state = false, action) => {
        if (action.filter !== filter) {
            return state
        }
        switch (action.type) {
            case 'FETCHING_DATA':
            case 'POSTING_DATA':
            case 'UPDATING_DATA':
            case 'DELETING_DATA':
                return true
            case 'FETCHING_DATA_SUCCESS':
            case 'POSTING_DATA_SUCCESS':
            case 'UPDATING_DATA_SUCCESS':
            case 'DELETING_DATA_SUCCESS':
            case 'DELETING_DATA_FAIL':
            case 'POSTING_DATA_FAIL':
            case 'UPDATING_DATA_FAIL':
            case 'FETCHING_DATA_FAIL':
                return false
            default:
                return state
        }
    }
    // const page = (state = 1, action) => {
    //     if(action.filter !== filter) {
    //         return state
    //     }
    //     switch(action.type) {
    //         case 'SET_PAGE':
    //             return action.page
    //         default:
    //             return state
    //     }
    // }

    const totalPage = (state = 1, action) => {
        if (action.filter !== filter) {
            return state
        }
        switch (action.type) {
            case 'FETCHING_DATA_SUCCESS':
                return action.response.pageCount
            case 'FETCHING_DATA_FAIL':
                return 0
            default:
                return state
        }
    }
    // const search = (state = '', action) => {
    //     if(action.filter !== filter) {
    //         return state
    //     }
    //     switch(action.type) {
    //         case 'START_SEARCH':
    //           return action.search
    //         case 'CLEAR_SEARCH':
    //           return ''
    //         default:
    //             return state
    //     }
    // }
    const error = (state = { message: null }, action) => {
        if (action.filter !== filter) {
            return state
        }
        switch (action.type) {
            case 'FETCHING_DATA_FAIL':
            case 'POSTING_DATA_FAIL':
            case 'UPDATING_DATA_FAIL':
                return {
                    ...state,
                    ...action.error
                }
            case 'FETCHING_DATA':
            case 'POSTING_DATA':
            case 'UPDATING_DATA':
                const nextState = {
                    message: null
                }
                return {
                    ...state,
                    ...nextState
                }
            default:
                return state
        }

    }
    if (filter === 'data') {


        const isDownload = (state = false, action) => {
            if (action.filter !== filter) {
                return state
            }
            switch (action.type) {
                case 'POSTING_DATA_SUCCESS':
                case 'POSTING_DATA_FAIL':
                    return true
                case 'DOWNLOAD_SUCCESS':
                    return false
                default:
                    return state
            }

        }
        return combineReducers({
            isFetching,
            error,
            totalPage,
            isDownload,
            listId: ids
        })
    } else {
        return combineReducers({
            isFetching,
            error,
            totalPage,
            listId: ids
        })
    }
}



const listId = combineReducers({
    methods: createIdList('methods'),
    media: createIdList('media'),
    data: createIdList('data')
})

export default listId