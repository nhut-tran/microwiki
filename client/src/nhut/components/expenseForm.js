import React from 'react'
import {connect} from 'react-redux'

class ExpenseForm extends React.Component {
    constructor(props) {
        super(props)
    }
    
    render() {
        return (
            <div>
                <form onSubmit ={this.props.onSubmit.bind(this)} >
                    <input name='description' onChange={(e) => {this.props.getData(e)}} value ={this.props.data.description}/><br/>
                    <input name='amount' onChange={(e) => {this.props.getData(e)}} value ={this.props.data.amount} /><br/>
                    <input type="submit"  value="Submit" />
                 </form>
            </div>
           

        )

    }
}

export default connect()(ExpenseForm)
