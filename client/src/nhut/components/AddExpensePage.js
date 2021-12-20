import React from 'react'
import {connect} from 'react-redux'
import ExpenseForm from './expenseForm'
import {addExpense} from '../actions/expenses'
class ExpensePage extends React.Component {
    constructor(props) {
        super(props)
        this.getData = this.getData.bind(this)
        this.submit = this.submit.bind(this)
        this.state = {
            description: '',
            amount: ''
       }
    }
    componentDidUpdate(props, state) {
        if(state.description !== this.state.description)
            console.log('update')
    }
    submit(e) {
        e.preventDefault()
        this.props.dispatch(addExpense(this.state, this.props.history))
    }
    getData(e) {
       const name =  e.target.name
       const value = e.target.value
       this.setState({
           [name]: value
       })
    }
    render() {
        return (
            <div>
            <h2>Add expense</h2>
                <ExpenseForm
                onSubmit = {this.submit}
                getData={this.getData}
                data = {this.state}
                />
            </div>
        )
    }
}

export default  connect()(ExpensePage)

