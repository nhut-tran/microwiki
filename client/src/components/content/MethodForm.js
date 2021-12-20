import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import useMethodState, { shapData } from '../../utils/methodFormHook'
import fetchData from '../../utils/fetchData'
import keyTranslate from '../../utils/translateKey'

function MethodForm({ data, handleSubmit }) {
  const [state, dispatch] = useMethodState()
  const [timer, setTimer] = useState(null)
  useEffect(() => {
    if (data) {
      dispatch({ type: 'SET_STATE', state: data })
    }
  }, [data])
  console.log(state)

  const setSeach = (search, ind, index) => {
    clearTimeout(timer)
    if (search) {
      setTimer(setTimeout(() => fetchData('get', `/media?page=ad&name=${search}`, '').then((res) => {
        dispatch({
          type: 'SET_MEDIA_INFO',
          data: { mediaNameSearchList: res.data.data },
          ind,
          index
        })
      }), 1000))
    }
  }
  const ref = useRef([])
  return (
    <form className='form' onSubmit={(e) => { props.onSubmit(e) }}>
      {/* generel info */}
      <div className='form__box'>
        <div className='form__form-group'>
          <h3 className='header-tertinary'>Name of Method</h3><input
            value={state.name}
            type='text' name='name' onChange={(e) => dispatch({ type: 'SET_NAME', name: e.target.value })} />
        </div>
        {state.err.includes('name')
          && <div className='error-notification'>
            name is required
                    </div>
        }
        <div className='form__form-group'>
          <h3 className='header-tertinary'>Type of method</h3><select name='type'
            onChange={(e) => { dispatch({ type: 'SET_TYPE', types: e.target.value }) }}>
            <option selected disabled hidden>Lựa chọn phương pháp</option>
            <option value='quanlitative'>Định tính</option>
            <option value='quantitative'>Định lượng</option>
          </select>
        </div>
        {state.err.includes('type')
          && <div className='error-notification'>
            type is required
                    </div>
        }
        <div className='form__form-group'>
          <h3 className='header-tertinary'>Long Duration</h3><input value={state.longDuration}
            type='text' name='long-duration' onChange={(e) => dispatch({ type: 'SET_LONG_DURATION', long: e.target.value })} />
        </div>
        {state.err.includes('longDuration')
          && <div className='error-notification'>
            Long Duration is required and must be a number
                    </div>
        }
        <div className='form__form-group'>
          <h3 className='header-tertinary'>Short duration</h3><input value={state.shortDuration}
            type='text' name='short-duration' onChange={(e) => dispatch({ type: 'SET_SHORT_DURATION', short: e.target.value })} />
        </div>
        {state.err.includes('shortDuration')
          && <div className='error-notification'>
            Short Duration is required and must be a number
              </div>
        }
        <div className='form__form-group'>
          <h3 className='header-tertinary'>Positive Control Strain</h3><input value={state.positiveControlStrain}
            type='text' name='positiveControlStrain' onChange={(e) => dispatch({ type: 'SET_POSITIVE_CONTROL', positive: e.target.value })} />
        </div>
        {state.err.includes('positiveControlStrain')
          && <div className='error-notification'>
            Positive Control Strain is required
                    </div>
        }
        <div className='form__form-group'>
          <h3 className='header-tertinary'>Negative Control Strain</h3><input value={state.negativeControlStrain}
            type='text' name='negativeControlStrain' onChange={(e) => dispatch({ type: 'SET_NEGATIVE_CONTROL', negative: e.target.value })} />
        </div>
        {state.err.includes('negativeControlStrain')
          && <div className='error-notification'>
            Negative Control Strain is required
                    </div>
        }
        {state.type === 'quantitative' && <div className='form__form-group'>
          <h3 className='header-tertinary'>Top reading Interval</h3><input value={state.topReadingInterval}
            type='text' name='topReadingInterval' onChange={(e) => dispatch({ type: 'SET_TOP_INTERVAL', top: e.target.value })} />
        </div>}
        {state.err.includes('topReadingInterval')
          && <div className='error-notification'>
            Top reading interval is required
                    </div>
        }
        {state.type === 'quantitative' && <div className='form__form-group'>
          <h3 className='header-tertinary'>Bottom reading Interval</h3><input value={state.bottomReadingInterval}
            type='text' name='bottomReadingInterval' onChange={(e) => dispatch({ type: 'SET_BOT_INTERVAL', bot: e.target.value })} />
        </div>}
        {state.err.includes('bottomReadingInterval')
          && <div className='error-notification'>
            Bottom reading Interval is required
                    </div>
        }

        <div className='form__form-group'>
          <h3 style={{ position: 'sticky', top: 0 }} className='header-tertinary'>Number of step <Link className='btn btn-action btn-action--small btn-action--method-form-small'
            onClick={() => dispatch({ type: 'ADD_STEP', num: 'add' })}
          >+</Link>
            <Link className='btn btn-action btn-action--small  btn-action--method btn-action--method-form-small'
              onClick={() => dispatch({ type: 'REMOVE_STEP', num: 'remove' })}
            >{'-'}</Link>
          </h3>
          <input onChange={(e) => {
            if (!isNaN(e.target.value) && e.target.value < 20) {
              dispatch({ type: 'SET_NUM_STEP', num: e.target.value })
            } else {
              alert('Please Enter number < 20')
            }

          }} type='text' name='numStep' />


        </div>
      </div>
      {/* step-------------------------info */}
      <div className='form__step'>
        {state.step.map((step, ind) => {
          return (
            <div className='form__step__box' ref={ref} key={ind}>
              <h3 className='header-tertinary'>Step {step.stepName}
                <Link className='btn btn-action btn-action--small  btn-action--method btn-action--method-form-small'
                  onClick={(e) => {
                    e.preventDefault()
                    dispatch({
                      type: 'SET_NUM_MEDIA',
                      index: ind,
                      flag: 'set'
                    })
                  }}
                >+</Link>
                <Link className='btn btn-action btn-action--small  btn-action--method btn-action--method-form-small'
                  onClick={(e) => {
                    e.preventDefault()
                    dispatch({
                      type: 'UNSET_NUM_MEDIA',
                      index: ind
                    })
                  }}
                >{'-'}</Link>
              </h3>

              <div className='form__step__name'>
                <label htmlFor="name">Name of step {ind + 1} </label>
                <input
                  value={step.stepName}
                  onChange={(e) => dispatch({ type: 'SET_STEP_NAME', name: e.target.value, ind })}
                  type='text' name='name' />
                {state.err.includes(`stepName-${ind + 1}`)
                  && <div className='error-notification'>
                    Step Name is required and not a number
                              </div>
                }
              </div>


              <div className='form__step__media'>
                {/* media in each step---------------------*/}
                {step.media.map((mediaStep, index) => {
                  return (
                    <div className='form__step__media__box'>

                      <div className='form__step__media--name'>
                        <label htmlFor="type">Name of Media step {ind + 1} - {index + 1} </label>
                        <input value={mediaStep.displayName} onChange={(e) => {

                          dispatch({
                            type: 'SET_MEDIA_INFO',
                            data: { displayName: e.target.value },
                            ind,
                            index
                          })
                          setSeach(e.target.value, ind, index)
                        }} type='text' />
                        {state.err.includes(`mediaName-${index + 1}`)
                          && <div className='error-notification'>
                            Media Name is required and not a number
                                      </div>
                        }
                        <div>{mediaStep.mediaNameSearchList && mediaStep.mediaNameSearchList.length > 0 &&
                          <select onChange={(e) => {
                            dispatch({
                              type: 'SET_MEDIA_INFO',
                              data: {
                                mediaName: e.target.value,
                                displayName: e.target.selectedOptions[0].innerText
                              },
                              ind,
                              index
                            })
                            dispatch({
                              type: 'UNSET_MEDIA_SEARCH_LIST',
                              ind,
                              index
                            })
                          }}>
                            <option selected disabled hidden value='quanlitative'>----</option>
                            {mediaStep.mediaNameSearchList && mediaStep.mediaNameSearchList.map(el => {
                              return (
                                <option value={el.id}>{el.name}</option>
                              )
                            })}
                          </select>
                        }</div>
                      </div>
                      <div className='form__step__media--quantity'>
                        <label htmlFor="type">Quantity Media step {ind + 1} - {index + 1} </label>
                        <input value={mediaStep.mediaQuantity} onChange={(e) => {
                          dispatch({
                            type: 'SET_MEDIA_INFO',
                            data: { mediaQuantity: e.target.value },
                            ind,
                            index
                          })
                        }} type='text' />
                        {state.err.includes(`mediaQuantity-${index + 1}`)
                          && <div className='error-notification'>
                            Media Quantity is required and must be a number
                                      </div>
                        }
                      </div>
                      <div className='form__step__media--unit'>
                        <label htmlFor="type">Unit of Media step {ind + 1} - {index + 1} </label>
                        <input value={mediaStep.mediaUnit} name onChange={(e) => {
                          dispatch({
                            type: 'SET_MEDIA_INFO',
                            data: { mediaUnit: e.target.value },
                            ind,
                            index
                          })
                        }} type='text' />
                        {state.err.includes(`mediaUnit-${index + 1}`)
                          && <div className='error-notification'>
                            Media Unit is required and must be mL, g, piece
                                      </div>
                        }
                      </div>

                      <div className='form__step__media--time'>
                        <label htmlFor="type">Incubate time (hour)</label>
                        <input value={mediaStep.time} onChange={(e) => {
                          dispatch({
                            type: 'SET_MEDIA_INFO',
                            data: { time: e.target.value },
                            ind,
                            index
                          })
                        }} type='text' />
                        {state.err.includes(`time-${index + 1}`)
                          && <div className='error-notification'>
                            Incubate time is required and not a number
                                      </div>
                        }
                      </div>
                      <div className='form__step__media--temp'>
                        <label htmlFor="type">Incubate temparature</label>
                        <input value={mediaStep.temp} onChange={(e) => {

                          dispatch({
                            type: 'SET_MEDIA_INFO',
                            data: { temp: e.target.value },
                            ind,
                            index
                          })
                        }} type='text' />
                        {state.err.includes(`temp-${index + 1}`)
                          && <div className='error-notification'>
                            Incubate temparature is required must be a number
                                         </div>
                        }
                      </div>
                      <div className='form__step__media--tempRange'>
                        <label htmlFor="type">Incubate temparature Range</label>
                        <input value={mediaStep.tempRange} onChange={(e) => {

                          dispatch({
                            type: 'SET_MEDIA_INFO',
                            data: { tempRange: e.target.value },
                            ind,
                            index
                          })
                        }} type='text' />
                        {state.err.includes(`tempRange-${index + 1}`)
                          && <div className='error-notification'>
                            Incubate temparature range is required must be a number
                                         </div>
                        }
                      </div>
                      <div className='form__step__media--note'>
                        <label htmlFor="type">Note</label>
                        <input value={mediaStep.note} onChange={(e) => {
                          dispatch({
                            type: 'SET_MEDIA_INFO',
                            data: { note: e.target.value },
                            ind,
                            index
                          })
                        }} type='text' />
                      </div>
                      <div className='form__step__media--action'>
                        <label htmlFor="type">Action to do {ind + 1} - {index + 1} </label>
                        <input value={mediaStep.action} onChange={(e) => {
                          dispatch({
                            type: 'SET_MEDIA_INFO',
                            data: { action: e.target.value },
                            ind,
                            index
                          })
                        }} type='text' />
                        {state.err.includes(`action-${index + 1}`)
                          && <div className='error-notification'>
                            Action is required
                                      </div>
                        }
                      </div>
                    </div>
                  )
                }
                )
                }
              </div>
              {/* <div className='form__box'>
                <a className='btn btn-action' onClick={(e) => {
                  e.preventDefault()
                  dispatch({
                    type: 'SET_NUM_MEDIA',
                    index: ind,
                    flag: 'set'
                  })
                }} >Add media</a>
                <a className='btn btn-action' onClick={(e) => {
                  e.preventDefault()
                  dispatch({
                    type: 'UNSET_NUM_MEDIA',
                    index: ind
                  })
                }} >Remove media</a>
              </div> */}
            </div>

          )
        })}
      </div>
      <div className='form__box'>
        <a className='btn btn-action' onClick={(e) => {
          const data = shapData(state)
          if (!data.err) {
            handleSubmit(e, data.shapeState)
          } else {
            dispatch({
              type: 'SET_ERROR',
              err: data.err
            })
          }
        }}> SAVE </a>
      </div>

    </form>
  )

}

export default MethodForm