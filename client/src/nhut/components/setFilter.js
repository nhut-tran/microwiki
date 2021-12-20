import React from 'react'
import {connect} from 'react-redux'
import {setTextFilter, sortByDate, sortByAmount } from '../actions/filters'
function setInputFilter(props) {
    return (
        <div>
            <input defaultValue = 'Filter Input' value = {props.filter.text} onChange = {(e) => {
                props.dispatch(setTextFilter(e.target.value))
            }} />

            <select  onChange={(e) => {
                e.target.value === 'date' ? props.dispatch(sortByDate()) :
                props.dispatch(sortByAmount())
            }}  value = {props.filter.sortBy} >
                <option value = 'date'>Date</option>
                <option value = 'amount'>Amount</option>
            </select>
        </div>
    )
}

const connectsetInputFilter = (state) => {
    return {
        filter: state.filters
    }
}

export default connect(connectsetInputFilter)(setInputFilter)