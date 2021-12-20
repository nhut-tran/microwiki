import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { checkStatus } from '../store/action/userAction'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import Header from '../components/Header'
import AddNew from '../components/content/AddNew'
import MainContent from '../components/content/mainContent'
import Footer from '../components/Footer'
import LookupContent from '../components/content/LookupContent'
import Edit from '../components/content/Edit'
import NotFound from '../components/content/NotFound'
import Admin from '../components/Admin'
import Signup from '../components/content/Signup'
import SignupConfirm from '../components/content/SignupConfirm'
import UserAccount from '../components/content/UserAccount'
import Loading from '../utils/Loading'



const AppRouter = (props) => {
    const [checkUser, setCheckUser] = useState(false)
    useEffect(() => {

        props.dispatch(checkStatus(setCheckUser))

    }, [])
    if (checkUser) {


        return (<BrowserRouter>
            <>
                <Header />

                <Switch>

                    <Route path="/" component={MainContent} exact={true} />
                    <PrivateRoute path="/admin" role={['admin']} component={Admin} exact={true} />
                    <Route path='/lookup/:filter/:page?/:id?' component={LookupContent} exact={true} />
                    <PublicRoute path="/user/login" component={Signup} exact={true} />
                    <PublicRoute path="/user/newSignup" component={Signup} exact={true} />
                    <PrivateRoute path="/user/myAccount" role={['admin', 'user']} component={UserAccount} exact={true} />
                    <PrivateRoute path="/user/changePassword" role={['admin', 'user']} component={Signup} exact={true} />
                    <Route path="/user/accountactivate/:token" component={SignupConfirm} exact={true} />
                    <PrivateRoute path='/edit/:filter/:page?/:id?' role={['admin', 'user']} component={Edit} exact={true} />
                    <PrivateRoute path='/admin/:filter/:page?/:id?' role={['admin']} component={Edit} exact={true} />
                    <PrivateRoute path="/addnew/:filter" role={['admin']} component={AddNew} />
                    <Route path='*' component={NotFound} />
                </Switch>

                <Footer />
            </>


        </BrowserRouter>)
    } else {
        return <Loading />
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
}


export default connect(mapStateToProps)(AppRouter)