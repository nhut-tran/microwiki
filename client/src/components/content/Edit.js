import React from 'react'
import LeftPanel from './LeftPanel'
import RightPanel from './RightPanel'
import {useHistory, useParams} from 'react-router-dom'
import {connect} from 'react-redux'
import {updateData} from '../../store/action/dataAction'

function Edit (props) {
  const history = useHistory()
  const {filter, id} = useParams()
  const handleSubmit = (e, data) => {
      e.preventDefault
      props.dispatch(updateData(filter, data, id, history))
  }
          return (
            <div className='edit'>
                <LeftPanel />
                <RightPanel handleSubmit ={handleSubmit}/>
            </div>
          )         
}

export default connect()(Edit)