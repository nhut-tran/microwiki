import React, { useEffect, useState } from 'react'
import checkInput from '../../utils/checkInput'
import useMediaForm from '../../utils/mediaFormHook'

function MediaForm({ data, handleSubmit }) {
  const [state, dispatch] = useMediaForm()
  const [err, setErr] = useState([])

  useEffect(() => {
    if (data) {
      dispatch({
        type: 'SET_INITIAL',
        state: data
      })
    }
  }, [data])
  return (
    <form className='form'>
      {err.map((el) => {
        return (
          <div className='error-notification'>invalid data in field {el}</div>
        )
      })}
      <div className='form__form-group'>
        <h3 className='header-tertinary' for='name'>Name:</h3>
        <input type='text'
          value={state.name}
          onChange={(e) => dispatch({
            type: 'SET_DATA',
            data: { name: e.target.value }
          })} name='name' placeholder='name' />
      </div>
      <div className='form__form-group'>
        <h3 className='header-tertinary' for='typeByUse'>TypeByUse:</h3>
        <input type='text' value={state.typeByUse} onChange={(e) => dispatch({
          type: 'SET_DATA',
          data: { typeByUse: e.target.value }
        })} name='typeByUse' placeholder={'typeByUse'} />
      </div>
      <div className='form__form-group'>
        <h3 className='header-tertinary' for='typeByPhysical'>TypeByPhysical:</h3>
        <input type='text' value={state.typeByPhysical} onChange={(e) => dispatch({
          type: 'SET_DATA',
          data: { typeByPhysical: e.target.value }
        })} name='typeByPhysical' placeholder={'typeByPhysical'} />
      </div>
      <div className='form__form-group'>
        <h3 className='header-tertinary' for='description'>Description:</h3>
        <textarea value={state.description} onChange={(e) => dispatch({
          type: 'SET_DATA',
          data: { description: e.target.value }
        })} name='description' placeholder={'description'} />
      </div>
      <div className='form__form-group'>
        <h3 className='header-tertinary' for='gramPerLit'>GramPerLit:</h3>
        <input value={state.GamPerLitter} type='number' onChange={(e) => dispatch({
          type: 'SET_DATA',
          data: { GamPerLitter: e.target.value * 1 }
        })} name='gramPerLit' placeholder={state.GamPerLitter} />
      </div>
      <div className='form__box'>
        <a className='btn btn-action' onClick={(e) => {
          const error = checkInput(
            ['GamPerLitter'],
            ['name', 'typeByUse', 'typeByPhysical', 'description'],
            state)
          if (error.length === 0) {
            handleSubmit(e, state)
          } else {
            setErr(error)
          }
        }}> SAVE </a>
      </div>
    </form>
  )
}

export default MediaForm