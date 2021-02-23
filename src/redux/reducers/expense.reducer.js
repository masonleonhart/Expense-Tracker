import { combineReducers } from 'redux';

const expenseReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_EXPENSES':
            return action.payload;
        default:
            return state;
    };
};

export default combineReducers({
    expenseReducer,
});