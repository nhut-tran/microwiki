import React from 'react'
import {connect} from 'react-redux'
import {withRouter, useHistory} from 'react-router-dom'
import {addData} from '../../store/action/dataAction'
import MediaForm from './Mediaform'
import MethodForm from './MethodForm'

function AddMedia({filter, dispatch}) {
    const history = useHistory()
    const handleSubmit = (e, data) => {
        e.preventDefault
        dispatch(addData(filter, data, history))
    }
    
       return (
           <>
           { filter === 'media' ? <MediaForm handleSubmit ={handleSubmit}/> : <MethodForm handleSubmit ={handleSubmit}/>}
           </>
       )
    
    
}

const mapStateToProps = (state, {match}) => {
    const filter = match.params.filter
    return {
        filter
    }
}
export default withRouter(connect(mapStateToProps)(AddMedia))