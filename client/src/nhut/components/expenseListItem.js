import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {removeExpense} from '../actions/expenses'
 function expenseItem(props) {
    return (
        <div>
             <div>
                <h3>{props.expense.description}</h3>
                <p>{props.expense.amount} - {Date.parse(props.expense.createAt)/1000}</p>
             </div>
            <Link to={`edit/${props.expense._id}`}>Edit</Link>
             <button onClick={() => {
                 props.dispatch(removeExpense({id:props.expense._id}))
                }
            }>Remove expense</button>
        </div>
        
    )
}

export default connect()(expenseItem)

//props.dispatch(removeExpense(props.expense))