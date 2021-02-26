import { combineReducers } from 'redux';

const uncategorizedExpenseReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_UNCATEGORIZED':
            return action.payload;
        default:
            return state;
    };
};

const currentDayReducer = (state = 0, action) => {
    switch (action.type) {
        case 'SET_DAY':
            return state + action.payload;
        default:
            return state;
    };
};

const currentMonthReducer = (state = 0, action) => {
    switch (action.type) {
        case 'SET_MONTH':
            return state + action.payload;
        default:
            return state;
    };
};

const dailyExpenseReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_DAILY_EXPENSES':
            return action.payload;
        default:
            return state;
    };
};

const dailySumsReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_DAILY_SUMS':
            return action.payload;
        default:
            return state;
    };
};

const monthlyExpenseReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_MONTHLY_EXPENSES':
            return action.payload;
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
    uncategorizedExpenseReducer,
    newExpenseReducer,
    newIncomeReducer,
    currentDayReducer,
    currentMonthReducer,
    dailyExpenseReducer,
    dailySumsReducer,
    monthlyExpenseReducer,
});