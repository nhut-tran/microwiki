import React from 'react'
import {NavLink} from 'react-router-dom'
 class Header extends React.Component{
    constructor(props) {
        super(props)
    }
   
    render() {
        console.log(this.props)
        return (
            
       <header>
            <h1>Expensify</h1>
            <NavLink to='/'>Home Page</NavLink>
            <NavLink to='/create'>Create Expense</NavLink>
            <NavLink to='/edit'>edit Expense</NavLink>
            <NavLink to='/help'>Expense</NavLink>
        </header>
   )
    
    }
}

export default Header
