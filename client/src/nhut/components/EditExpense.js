import React from 'react'
import {connect} from 'react-redux'
import ExpenseForm from './expenseForm'
import { editExpense } from '../actions/expenses'
class EditExpense extends React.Component {
    constructor(props) {
        super(props)
        this.getData = this.getData.bind(this)
        this.submit = this.submit.bind(this)
        this.state = {
          description: '',
          amount: ''
        }
    }
    componentDidMount() {
        
        fetch(`http://localhost:3000/exp/${this.props.match.params.id}`).then(res => res.json())
        .then((res) => {
            this.setState({
                description: res.description,
                amount: res.amount
              })
         })

    }
    getData(e) {
        const name =  e.target.name
        const value = e.target.value
        this.setState({
            [name]: value
        })
     }
    submit(e) {
        e.preventDefault()
        this.props.dispatch(editExpense(this.props.match.params.id, this.state, this.props.history))
    }
    render() {
        return (
            <div>
                <h2>Edit Expense</h2>
                <ExpenseForm
                data = {this.state}
                getData={this.getData}
                onSubmit = {this.submit}
                />
            </div>
        )
    }
}

export default connect()(EditExpense)