import React from 'react'
import {Route, Redirect, useParams} from 'react-router-dom'
import {connect} from 'react-redux'
import {getCurrentPage} from '../store/configureStore/appStore'

const ModifiedRoute = ({state, component:Component, ...rest}) => {

    const {filter, page} = useParams()
    const Statepage = getCurrentPage(state, filter)
    console.log(page == Statepage, page, Statepage, useParams())
    return (
        <Route {...rest} component = {(props) => {
            return page == Statepage ?  (<Component {...props} />) : (<Redirect to='/' />)  
        }}/>
    )
}

const mapStateToProps = (state, {match}) => {
    return state
}

export default connect(mapStateToProps)(ModifiedRoute)