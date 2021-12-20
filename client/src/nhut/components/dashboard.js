import React from 'react'
import {connect} from 'react-redux'
import ExpenseList from './expenseList'
import SetFilter from './setFilter'
import selectExpense from '../selectors/expenses'
import {getExpense} from '../actions/expenses'
class Dashboard extends React.Component {
   
    componentDidMount() {
        if(this.props.expense.length === 0) {
            console.log('call fetc get Data')
            this.props.dispatch(getExpense())
       }
    }
    render() {
        let dashboard
        if(this.props.expense.length === 0) {
            dashboard = <h4>Loading...</h4>
        } else {
           dashboard =  <div>
                <ExpenseList expense = {this.props.expense}/>
                <SetFilter />
            </div>
        }
        return (
            <div>
            <h3>Expense Data</h3>
            {dashboard}
            </div>
           
        )
    }
}

const connectData = (state) => {
    console.log(state)
   return {
    expense: selectExpense(state.expenses, state.filters)
       
   }  
}


export default connect(connectData)(Dashboard)
