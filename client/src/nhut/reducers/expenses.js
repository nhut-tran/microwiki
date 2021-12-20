// Expenses Reducer

const expensesReducerDefaultState = [];

export default (state = expensesReducerDefaultState, action) => {
  switch (action.type) {
    case 'ADD_EXPENSE':
      return [
        ...state,
        action.expense
      ];
    case 'START_EXPENSE':
      return action.expense
    case 'REMOVE_EXPENSE':
      return state.filter(({ _id }) => _id !== action.id);
    case 'EDIT_EXPENSE':
      return state.map((expense) => {
  
        if (expense._id === action.id) {
          return {
            ...expense,
            ...action.updates
          };
        } else {
          return expense;
        };
      });
    default:
      return state;
  }
};
