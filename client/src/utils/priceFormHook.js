import { useReducer } from 'react'
import checkInput from './checkInput'

function priceFormReducer(defaultState = { data: [], err: [] }) {

    function reducer(state, action) {
        const nextState = { ...state }
        switch (action.type) {
            case 'SET_STATE':
                return { ...action.state }
            case 'SET':
                // if (action.key === 'unit') {
                //     nextState.data[action.ind].media[action.index][action.key] = action.value
                //     return nextState
                // } else {
                if (checkData(nextState, action.key, action.value, action.ind, action.index)) {
                    return nextState
                } else {
                    nextState.data[action.ind].media[action.index][action.key] = action.value
                    return nextState
                }
            //  }
            case 'ADD_TOOL':
                if (nextState.data[action.ind].media[action.index].tool.length < 8) {
                    const currTool = [...nextState.data[action.ind].media[action.index].tool]
                    const newTool = currTool.concat({ toolPrice: 0, toolName: '', toolQuantity: 0 })
                    nextState.data[action.ind].media[action.index].tool = [...newTool]

                }
                return nextState
            case 'REMOVE_TOOL':
                if (nextState.data[action.ind].media[action.index].tool.length > 1) {
                    const currTool = [...nextState.data[action.ind].media[action.index].tool]
                    currTool.pop()
                    nextState.data[action.ind].media[action.index].tool = [...currTool]

                }
                return nextState
            case 'SET_TOOL':
                if (action.key === 'toolName') {
                    nextState.data[action.ind].media[action.index].tool[action.toolIndex][action.key] = action.value
                    return nextState
                } else {
                    if (checkData(nextState, action.key, action.value, action.ind, action.index, action.toolIndex)) {
                        return nextState
                    } else {
                        nextState.data[action.ind].media[action.index].tool[action.toolIndex][action.key] = action.value
                        return nextState
                    }
                }
            case 'SET_ERR':
                nextState.err = [...action.err]
                return nextState
            case 'REMOVE_ERR':
                nextState.err = []
                return nextState
            default:
                return state
        }
    }

    return useReducer(reducer, defaultState)

}


const checkData = (state, key, value, ind, index, toolIndex = '') => {
    // input is string validate (ex 'unit' input ) and number validate

    //seperate string and number cause checkInput func have seperate input params for each type;
    let keyString = [], keyNum = [];
    if (key === 'unit') {
        keyString = [key]
        keyNum = []
    } else {
        keyNum = [key]
    }
    let err = checkInput(keyNum, keyString, { [key]: value }, `${ind + 1}-${index + 1}${toolIndex}`)

    const foundErr = state.err.findIndex(el => el === `${key}-${ind + 1}-${index + 1}${toolIndex}`)
    if (err.length > 0) {
        if (foundErr < 0) {
            state.err = [...state.err, ...err]
        }
        return true
    } else {
        if (foundErr >= 0) {
            state.err = [...state.err.slice(0, foundErr), ...state.err.slice(foundErr + 1)]

        }
        return false
    }
}

export const checkFinalData = (state) => {
    let firstLevel = [];
    let secondLevel = [];
    state.data.forEach((step, ind) => {
        step.media.forEach((media, index) => {
            firstLevel = [...firstLevel, ...checkInput(['mediaQuantity', 'weight', 'package', 'price'], ['unit'], media, `${ind + 1}-${index + 1}`)]
            media.tool.forEach((tool, toolIndex) => {

                secondLevel = [...secondLevel, ...checkInput([], [], tool, `${ind + 1}-${index + 1}${toolIndex}`)]
                console.log(tool.toolName.length > 0 && tool.toolName !== ' ')
                if (tool.toolName.length > 0 && tool.toolName !== ' ') {
                    if (tool.toolPrice === 0) {
                        secondLevel = [...secondLevel, `toolPrice-${ind + 1}-${index + 1}${toolIndex}`]
                    }
                    if (tool.toolQuantity === 0) {
                        secondLevel = [...secondLevel, `toolQuantity-${ind + 1}-${index + 1}${toolIndex}`]
                    }
                } else if (tool.toolPrice !== 0 || tool.toolQuantity !== 0) {
                    if (tool.toolName.length === 0) {
                        secondLevel = [...secondLevel, `toolName-${ind + 1}-${index + 1}${toolIndex}`]
                    }
                }


            })
        })
    })

    if (firstLevel.length > 0 || secondLevel.length > 0) {
        console.log([...firstLevel, ...secondLevel])
        return [...firstLevel, ...secondLevel]

    } else {
        return []
    }
}



export default priceFormReducer