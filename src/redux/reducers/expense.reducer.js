import { combineReducers } from 'redux';
import moment from 'moment';

const expenseReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_EXPENSES':
            return action.payload;
        default:
            return state;
    };
};

const currentDayReducer = (state = 0, action) => {
    switch (action.type) {
        case 'INCREMENT_DAY':
            state++;
            return state++;
        case 'DECREMENT_DAY':
            state--;
            return state++;
        case 'SET_DAY':
            state += action.payload;
            return state;
        default:
            return state;
    };
};

const newExpenseReducer = (state = { category_id: 0, name: '', amount: '', date: '' }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case 'SET_NEW_EXPENSE_CATEGORY':
            newState.category_id = action.payload;
            return newState;
        case 'SET_NEW_EXPENSE_NAME':
            newState.name = action.payload;
            return newState;
        case 'SET_NEW_EXPENSE_AMOUNT':
            newState.amount = action.payload;
            return newState;
        case 'SET_NEW_EXPENSE_DATE':
            newState.date = action.payload;
            return newState;
        case 'RESET_NEW_EXPENSE_REDUCER':
            return state = { category_id: 0, name: '', amount: '', date: '' };
        default:
            return state;
    };
};

const newIncomeReducer = (state = { income: true, name: '', amount: '', date: '' }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case 'SET_NEW_INCOME_NAME':
            newState.name = action.payload;
            return newState;
        case 'SET_NEW_INCOME_AMOUNT':
            newState.amount = action.payload;
            return newState;
        case 'SET_NEW_INCOME_DATE':
            newState.date = action.payload;
            return newState;
        case 'RESET_NEW_INCOME_REDUCER':
            return state = { category_id: 0, name: '', amount: '', date: '' };
        default:
            return state;
    };
};

export default combineReducers({
    expenseReducer,
    newExpenseReducer,
    newIncomeReducer,
    currentDayReducer,
});