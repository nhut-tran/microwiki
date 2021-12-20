import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
const PublicRoute = ({user, component:Component, ...rest}) => {
    return (
        <Route {...rest} component = {(props) => {
            return user.isLogined ? (<Redirect to='/' />)  : (<Component {...props} />)
        }}/>
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(PublicRoute)