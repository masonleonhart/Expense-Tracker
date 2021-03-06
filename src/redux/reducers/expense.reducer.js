import { combineReducers } from 'redux';
import moment from 'moment';

const uncategorizedExpenseReducer = (state = [], action) => {
    // manages list of uncategorized transactions
    switch (action.type) {
        case 'SET_UNCATEGORIZED':
            return action.payload;
        default:
            return state;
    };
};

const catViewNameReducer = (state = '', action) => {
    // manages subcategory name of list of transactions in modal
    switch (action.type) {
        case 'SET_CAT_VIEW_NAME':
            return action.payload;
        default:
            return state;
    };
};

const categoryExpenseReducer = (state = [], action) => {
    // manages list of subcategory expenses
    switch (action.type) {
        case 'SET_CAT_TRANSACTIONS':
            return action.payload;
        default:
            return state;
    };
};

const subcatViewNameReducer = (state = '', action) => {
    // manages subcategory name of list of transactions in modal
    switch (action.type) {
        case 'SET_SUBCAT_VIEW_NAME':
            return action.payload;
        default:
            return state;
    };
};

const subcategoryExpenseReducer = (state = [], action) => {
    // manages list of subcategory expenses
    switch (action.type) {
        case 'SET_SUBCAT_TRANSACTIONS':
            return action.payload;
        default:
            return state;
    };
};

const currentDayReducer = (state = 0, action) => {
    // manages the current day 0 = today
    switch (action.type) {
        case 'SET_DAY':
            return state + action.payload;
        case 'GO_TO_DAY':
            return action.payload;
        default:
            return state;
    };
};

const currentMonthReducer = (state = 0, action) => {
    // manages current month 0 = this month
    switch (action.type) {
        case 'SET_MONTH':
            return state + action.payload;
        case 'GO_TO_MONTH':
            return action.payload;
        default:
            return state;
    };
};

const dailyExpenseReducer = (state = [], action) => {
    // manages list of expenses for specified day
    switch (action.type) {
        case 'SET_DAILY_EXPENSES':
            return action.payload;
        default:
            return state;
    };
};

const dailySumsReducer = (state = [], action) => {
    // manages list of daily sums for the month view
    switch (action.type) {
        case 'SET_DAILY_SUMS':
            return action.payload;
        default:
            return state;
    };
};

const monthlyExpenseReducer = (state = [], action) => {
    // manages list of expenses for specified month
    switch (action.type) {
        case 'SET_MONTHLY_EXPENSES':
            return action.payload;
        default:
            return state;
    };
};

const newExpenseReducer = (state = { income: false, category_id: '', name: '', amount: '', date: moment().format('YYYY-MM-DD') }, action) => {
    // manages values for the new expenses inputs
    let newState = { ...state };

    switch (action.type) {
        case 'SET_NEW_EXPENSE_INCOME_TRUE':
            newState.income = true;
            return newState;
        case 'SET_NEW_EXPENSE_INCOME_FALSE':
            newState.income = false;
            return newState;
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
            return state = { income: false, category_id: 0, name: '', amount: '', date: moment().format('YYYY-MM-DD') };
        default:
            return state;
    };
};

export default combineReducers({
    uncategorizedExpenseReducer,
    catViewNameReducer,
    categoryExpenseReducer,
    subcatViewNameReducer,
    subcategoryExpenseReducer,
    newExpenseReducer,
    currentDayReducer,
    currentMonthReducer,
    dailyExpenseReducer,
    dailySumsReducer,
    monthlyExpenseReducer,
});