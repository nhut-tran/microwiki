import React from 'react'
import Header from '../components/header'
import Dashboard from '../components/dashboard'
import AddExpensePage from '../components/AddExpensePage'
import EditExpensePage from '../components/EditExpense'
import Notfound from '../components/notfound'
import Help from '../components/help'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import '../style/style.scss'

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Header />
            <Switch>
                <Route path="/" component ={Dashboard} exact={true}/>
                <Route path ="/create" component= {AddExpensePage}/>
                <Route path ="/edit/:id" component= {EditExpensePage}/>
                <Route path ="/help" component= {Help}/>
                <Route component= {Notfound}/>
            </Switch>
        </div>
    </BrowserRouter>
)

export default AppRouter