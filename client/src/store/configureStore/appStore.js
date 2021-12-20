import { createStore, combineReducers, applyMiddleware } from 'redux';
import listId from '../reducer/createIdList'
import list from '../reducer/createList'
import userReducer from '../reducer/userReducer'
import thunk from 'redux-thunk'
import logger from 'redux-logger'


export default () => {
  const store = createStore(
    combineReducers({
      list,
      listId,
      user: userReducer
    }),
    applyMiddleware(thunk, logger)
  );

  return store;
};

export const getData = (state, filter, paramsId) => {
  let ids
  if (state.listId[filter]) {
    ids = state.listId[filter].listId
    const data = ids.map(id => state.list[filter][id])
    if (paramsId) return data[paramsId]
    return data
  }
}

export const getTotalPage = (state, filter) => {
  const totalPage = state.listId[filter].totalPage * 1
  return [...Array(totalPage).keys()].map(x => ++x)
}
export const getCurrentPage = (state, filter) => {
  return filter ? state.listId[filter].page : 1
}
export const getSearchTerm = (state, filter) => {
  if (filter) return state.listId[filter].search
  return null
}
export const getDetailData = (state, filter, id) => {

  if (id && state.list[filter][id]) {
    let data = JSON.parse(JSON.stringify(state.list[filter][id]))
    // normalize data method filter
    if (filter === 'methods') {
      const media = [...data.media]
      const stepName = []
      //remove duplicate stepname => result: stepName = ['step name 1', 'step name 2']
      media.map((el) => {
        if (!stepName.includes(el.stepName)) {
          stepName.push(el.stepName)
        }

      })
      //normalize media as step => step = [{stepName": step name 1, media: []}]
      const step = stepName.map(el => ({
        stepName: el,
        media: []
      }))
      step.map((el) => {
        media.forEach((e) => {
          if (el.stepName === e.stepName) {
            console.log(e)
            return el.media.push(
              {
                action: e.action,
                mediaName: e.mediaName._id,
                displayName: e.mediaName.name,
                mediaQuantity: e.mediaQuantity,
                mediaUnit: e.mediaUnit,
                time: e.time,
                temp: e.temp,
                tempRange: e.tempRange,
                note: e.note
              })
          }
        })
      })

      delete data.media
      data.step = step
      return data
    }
    return data

  } else {
    if (filter === 'methods' || filter === 'data') {

      return { step: [] }
    } else {

      return {}
    }
  }
}






export const getisFetching = (state, filter) => state.listId[filter].isFetching

export const getisDownload = (state, filter) => state.listId[filter].isDownload

export const getErr = (state, filter) => state.listId[filter].error