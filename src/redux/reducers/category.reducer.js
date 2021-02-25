import { combineReducers } from 'redux';

const categoryReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return action.payload;
        default:
            return state;
    };
};

const dailyCategoryReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_DAILY_CATEGORIES':
            return action.payload;
        default:
            return state;
    };
};

const newCategoryReducer = (state = { name: '' }, action) => {
    let newState = { ...state };

    switch (action.type) {
        case 'SET_NEW_CATEGORY_NAME':
            newState.name = action.payload;
            return newState;
        case 'RESET_NEW_CATEGORY_REDUCER':
            return state = { name: '' };
        default:
            return state;
    }
};

export default combineReducers({
    categoryReducer,
    dailyCategoryReducer,
    newCategoryReducer,
});