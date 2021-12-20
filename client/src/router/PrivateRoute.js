import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import checkRole from '../utils/checkRole'
const PrivateRoute = ({ user, role, component: Component, ...rest }) => {

    const allowed = checkRole(role, user.userRole)


    return (
        <Route {...rest} render={(props) => {
            return allowed ? (<Component {...props} />) : (<Redirect to='/notfound' />)
        }} />
    )
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(PrivateRoute)