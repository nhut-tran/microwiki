
// ADD_EXPENSE
export const addExpense1 = (
  {
    _id,
    description = '',
    note = '',
    amount = 0,
    createAt = ''
  } = {}
) => ({
  type: 'ADD_EXPENSE',
  expense: {
    _id,
    description,
    note,
    amount,
    createAt,
  }
});
export const addExpense = (newExpense, history) => {
  console.log(JSON.stringify(newExpense))
  const options = {
    method: 'POST',
    body: JSON.stringify(newExpense),
    headers: {
        'Content-Type': 'application/json'
    }
    
}

  return (dispatch) => {
    fetch('http://localhost:3000/exp', options).then(res => res.json())
        .then((res) => {
          dispatch({
            type: 'ADD_EXPENSE',
            expense: res
          })
          history.push('/')
        })
       

  }
}

// REMOVE_EXPENSE
export const removeExpense = ({ id } = {}) => {
  console.log(id)
return   {
    type: 'REMOVE_EXPENSE',
    id
  };
}

// EDIT_EXPENSE
export const editExpense1 = (id, updates) => ({
  type: 'EDIT_EXPENSE',
  id,
  updates
});
export const editExpense = (id, updates, history) => {
console.log(JSON.stringify(updates))
 const options = {
    method: 'PATCH',
    body: JSON.stringify(updates),
    headers: {
        'Content-Type': 'application/json'
    }
    
  }
  return (dispatch) => {
    fetch(`http://localhost:3000/exp/${id}`, options).then(res => res.json())
        .then((res) => {
          console.log(res)
          dispatch({
            type: 'EDIT_EXPENSE',
            id,
            updates: res
          })
          history.push('/')
        })
       

  }

}




export const startExpense = (expense) => ({
  type: 'START_EXPENSE',
  expense
})
export const getExpense = () => {
  return (dispatch) => {
    fetch('http://localhost:3000/exp').then(res => res.json())
        .then((res) => {
          dispatch(startExpense(res))
        })
  }
}
export const getExpenseById = (id) => {
  return (dispatch) => {
    fetch(`http://localhost:3000/exp/${id}`).then(res => res.json())
        .then((res) => {
          dispatch(startExpense(res))
        })
  }
}