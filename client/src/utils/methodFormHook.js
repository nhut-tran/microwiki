import { useReducer } from 'react'
import checkInput from './checkInput'

function methodStatehook() {

    const handleNumStep = (numStep) => {

        if (!isNaN(numStep) && numStep <= 20) {
            const stepArr = []
            for (let i = 1; i <= numStep; i++) {
                stepArr.push({
                    stepName: '',
                    media: [{
                        action: '',
                        mediaName: '',
                        mediaQuantity: 0,
                        mediaUnit: '',
                        time: 0,
                        temp: 0,
                        tempRange: 0,
                        note: 'Không có'
                    }],
                })
            }
            // const stepArr = [...Array(numStep).keys()].map(() => {
            //     return {
            //         stepName: '',
            //         media: [{
            //             actionToDo: '',
            //             mediaName: '',
            //             mediaQuantity: 0,
            //             mediaUnit: '',
            //             time: 0,
            //             temp: 0,
            //             note: 'Không có'
            //         }],
            //     }
            // })


            return stepArr
        }
    }
    const handleNumMedia = (ind, step) => {

        const media = step[ind].media.concat({
            action: '',
            mediaName: '',
            mediaNameSearchList: [],
            mediaQuantity: 0,
            mediaUnit: '',
            temp: 0,
            tempRange: 0,
            time: 0,
            note: 'Không có'

        })
        return media
    }

    const handleMediaInfo = (state, ind, index, data) => {
        const mediaInfo = state.step[ind].media[index]
        const key = Object.keys(data)
        key.forEach(el => {
            mediaInfo[el] = data[el]
        })

        state.step[ind].media[index] = mediaInfo
        return state
    }
    const handleUnsetMediaInfo = (state, ind, index) => {
        const mediaInfo = state.step[ind].media[index]
        mediaInfo.mediaNameSearchList = []
        state.step[ind].media[index] = mediaInfo
        return state
    }

    const handleUnSetNumMedia = (ind, step) => {
        step[ind].media.pop()
        return step[ind].media

    }


    function reducer(state, action) {
        const next = { ...state }
        switch (action.type) {
            case 'SET_STATE':
                return { ...next, ...action.state }
            case 'SET_NUM_STEP':
                const step = handleNumStep(action.num)
                return { ...state, step }
            case 'ADD_STEP':
                if (next.step.length < 12) {
                    next.step = next.step.concat({
                        stepName: '',
                        media: [{
                            action: '',
                            mediaName: '',
                            mediaQuantity: 0,
                            mediaUnit: '',
                            time: 0,
                            temp: 0,
                            tempRange: 0,
                            note: 'Không có'
                        }],
                    })
                }

                return next
            case 'REMOVE_STEP':
                if (next.step.length > 0) {

                    next.step.pop()
                }
                return next
            case 'SET_STEP_NAME':
                next.step[action.ind].stepName = action.name
                return next
            case 'SET_LONG_DURATION':
                next.longDuration = action.long
                return next
            case 'SET_SHORT_DURATION':
                next.shortDuration = action.short
                return next
            case 'SET_TOP_INTERVAL':
                next.topReadingInterval = action.top
                return next
            case 'SET_BOT_INTERVAL':
                next.bottomReadingInterval = action.bot
                return next
            case 'SET_POSITIVE_CONTROL':
                next.positiveControlStrain = action.positive
                return next
            case 'SET_NEGATIVE_CONTROL':
                next.negativeControlStrain = action.negative
                return next
            case 'SET_NUM_MEDIA':
                const nextState = { ...state }
                if (nextState.step[action.index].media.length < 15) {
                    nextState.step[action.index].media = handleNumMedia(action.index, nextState.step)
                }

                return nextState
            case 'UNSET_NUM_MEDIA':
                if (next.step[action.index].media.length > 1) {
                    next.step[action.index].media = handleUnSetNumMedia(action.index, next.step)
                }
                return next
            case 'SET_NAME':
                const name = action.name
                return { ...state, name }
            case 'SET_TYPE':
                const type = action.types
                return { ...state, type }
            case 'SET_MEDIA_INFO':
                return handleMediaInfo(next, action.ind, action.index, action.data)
            case 'UNSET_MEDIA_SEARCH_LIST':
                return handleUnsetMediaInfo(next, action.ind, action.index, action.data)
            case 'SET_ERROR':
                next.err = action.err
                return next
            default:
                return state
        }
    }

    const [state, dispatch] = useReducer(reducer, {
        name: '',
        type: '',
        longDuration: undefined,
        shortDuration: undefined,
        positiveControlStrain: '',
        negativeControlStrain: '',
        topReadingInterval: undefined,
        bottomReadingInterval: undefined,
        step: [],
        err: []

    })


    return [state, dispatch]
}
export const shapData = (state) => {
    const shapeState = Object.assign({ name: '', type: '', media: [] }, state)
    delete shapeState.step
    let firstLevel = [];
    let secondLevel = [];
    let thirdLevel = [];
    firstLevel = checkInput(['longDuration', 'shortDuration'], ['name', 'type', 'positiveControlStrain', 'negativeControlStrain'], shapeState)
    state.step.map((el, ind) => {
        //check err step name
        secondLevel = [...secondLevel, ...checkInput([], ['stepName'], el, ind + 1)]
        el.media.forEach((mediaInfo, index) => {
            //check err in mediainfo of each step
            console.log(mediaInfo)
            thirdLevel = [...thirdLevel, ...checkInput(['mediaQuantity'], ['mediaName', 'mediaUnit', 'temp', 'tempRange', 'time', 'action'], mediaInfo, index + 1)]
            shapeState.media.push({
                action: mediaInfo.action,
                stepName: el.stepName,
                mediaQuantity: mediaInfo.mediaQuantity,
                mediaName: mediaInfo.mediaName,
                mediaUnit: mediaInfo.mediaUnit,
                temp: mediaInfo.temp,
                tempRange: mediaInfo.tempRange,
                time: mediaInfo.time,
                note: mediaInfo.note
            })
        })
    })
    if (firstLevel.length > 0 || secondLevel.length > 0 || thirdLevel.length > 0) {
        console.log([...firstLevel, ...secondLevel, ...thirdLevel])
        return {
            err: [...firstLevel, ...secondLevel, ...thirdLevel]

        }
    } else {
        return { shapeState }

    }

}
export default methodStatehook