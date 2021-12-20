import React, { Component } from 'react'
import {connect} from 'react-redux'
import ExpenseListItem from './expenseListItem'

 class Expense extends Component {
 
    render() {
      return  (
         
            <div>
                <h3>Expen list</h3>
                {this.props.expense.map((el) => {
                    return <ExpenseListItem key={el.id} id={el.id} expense = {el} />
                })}
            </div>
        )
    } 
        
}


export default connect()(Expense)