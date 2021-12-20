
import fetchData from '../../utils/fetchData'


export const startState = (filter, page = 1, search = '') => {



  //get data from localStorage, fake it like fecthing data
  if (filter === 'data') {
    const JSONLocal = localStorage.getItem('data')
    const localData = JSON.parse(JSONLocal)
    const keys = []
    if (JSONLocal) {
      for (let [key, value] of Object.entries(localData)) {
        keys.push({
          name: key.split('idN')[1],
          _id: key.split('idN')[0],
          id: key.split('idN')[0],
          step: value
        })

      }
    }
    return (dispatch) => {
      dispatch({
        type: 'FETCHING_DATA_SUCCESS',
        filter,
        response: { data: [...keys], pageCount: 1 }
      })
    }
  } else {

    return (dispatch) => {
      dispatch({
        type: 'FETCHING_DATA',
        filter,
        page: 1
      })
      fetchData('get', `/${filter}?page=${page}&name=${search}`, '').then((res) => {
        if (res.status === 'success') {
          if (res.data.data.length === 0) {

            dispatch({
              type: 'FETCHING_DATA_FAIL',
              filter,
              error: {
                message: 'NOT FOUND'
              }
            })
          } else {
            dispatch({
              type: 'FETCHING_DATA_SUCCESS',
              filter,
              response: res.data
            })
          }
        } else if (res.status === 'fail') {
          dispatch({
            type: 'FETCHING_DATA_FAIL',
            filter,
            error: {
              message: res.message
            }
          })
        }
      })

    }
  }
}



export const exportExcel = (data) => {
  console.log(data)
  return (dispatch) => {
    dispatch({
      type: 'POSTING_DATA',
      filter: 'data',
      page: 1
    })
    fetchData('post', `/methods/exportexcel`, data).then((res) => {
      if (res.status === 'success') {
        dispatch({
          type: 'POSTING_DATA_SUCCESS',
          filter: 'data',
        })

      } else if (res.status === 'fail') {
        dispatch({
          type: 'POSTING_DATA_FAIL',
          filter: 'data',
          error: {
            message: res.message
          }
        })
      }
    })

  }


}
export const startSearch = () => {

}
export const setPage = (filter, page) => {
  return {
    type: 'SET_PAGE',
    filter,
    page
  }
}
export const setSearch = (filter, search) => {
  return {
    type: 'START_SEARCH',
    filter,
    search
  }
}
export const clearSearch = (filter) => {
  return {
    type: 'CLEAR_SEARCH',
    filter
  }
}
export const addData = (filter, data, history) => {
  return (dispatch) => {
    dispatch({
      type: 'POSTING_DATA',
      filter
    })
    fetchData('post', `/${filter === 'method' ? 'methods' : filter}`, data).then((res) => {
      if (res.status === 'success') {
        dispatch({
          type: 'POSTING_DATA_SUCCESS',
          filter,
          newData: res
        })
        history.push(`/lookup/${filter === 'method' ? 'methods' : filter}`)
      } else if (res.status === 'fail') {
        dispatch({
          type: 'POSTING_DATA_FAIL',
          filter,
          error: {
            message: res.message
          }
        })
      }
    })

  }
}
export const updateData = (filter, data, id, history) => {
  return (dispatch) => {
    dispatch({
      type: 'UPDATING_DATA',
      filter
    })
    fetchData('patch', `/${filter === 'method' ? 'methods' : filter}/${id}`, data).then((res) => {

      if (res.status === 'success') {
        dispatch({
          type: 'UPDATING_DATA_SUCCESS',
          filter,
          id,
          newData: res
        })
        history.push(`/edit/${filter === 'method' ? 'methods' : filter}`)
      } else if (res.status === 'fail') {
        dispatch({
          type: 'UPDATING_DATA_FAIL',
          filter,
          error: {
            message: res.message
          }
        })
      }
    })

  }
}

export const deleteData = (filter, id) => {
  return (dispatch) => {
    dispatch({
      type: 'DELETING_DATA',
      filter
    })
    if (filter !== 'data') {

      fetchData('delete', `/${filter === 'method' ? 'methods' : filter}/${id}`).then((res) => {
        if (res.status === 'success') {
          dispatch({
            type: 'DELETING_DATA_SUCCESS',
            filter,
            id,
            newData: res
          })
        } else if (res.status === 'fail') {
          dispatch({
            type: 'DELETING_DATA_FAIL',
            filter,
            error: {
              message: res.message
            }
          })
        }
      })
    } else if (filter === 'data') {
      const JSONLocal = localStorage.getItem('data')
      if (JSONLocal) {
        const localData = JSON.parse(JSONLocal)

        for (const i in localData) {
          if (i.includes(id)) {
            delete localData[i]
            console.log(i)
            break
          }
        }
        localStorage.setItem('data', JSON.stringify(localData))
      }
      dispatch({
        type: 'DELETING_DATA_SUCCESS',
        filter,
        id
      })
    }

  }
}

