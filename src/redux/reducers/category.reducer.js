import { combineReducers } from 'redux';

const categoryReducer = (state = [], action) => {
    // manages list of categories
    switch (action.type) {
        case 'SET_CATEGORIES':
            return action.payload;
        default:
            return state;
    };
};

const subcategoryReducer = (state = [], action) => {
    // manages list of subcategories (categories from plaid transactions)
    switch (action.type) {
        case 'SET_SUBCATEGORIES':
            return action.payload;
        default:
            return state;
    };
};

const dailyCategoryReducer = (state = [], action) => {
    // manages list of categories for specififed day
    switch (action.type) {
        case 'SET_DAILY_CATEGORIES':
            return action.payload;
        default:
            return state;
    };
};

const monthlyCategoryReducer = (state = [], action) => {
    // manages list of categories for specified month
    switch (action.type) {
        case 'SET_MONTHLY_CATEGORIES':
            return action.payload;
        default:
            return state;
    };
};

const newCategoryReducer = (state = { name: '' }, action) => {
    // manages value for new category input
    let newState = { ...state };

    switch (action.type) {
        case 'SET_NEW_CATEGORY_NAME':
            newState.name = action.payload;
            return newState;
        case 'RESET_NEW_CATEGORY_REDUCER':
            return state = { name: '' };
        default:
            return state;
    };
};

export default combineReducers({
    categoryReducer,
    subcategoryReducer,
    dailyCategoryReducer,
    monthlyCategoryReducer,
    newCategoryReducer,
});