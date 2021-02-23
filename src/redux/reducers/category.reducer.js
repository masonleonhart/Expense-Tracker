import { combineReducers } from 'redux';

const categoryReducer = (state = [], action) => {
    switch (action.type) {
        case 'SET_CATEGORIES':
            return action.payload;
        default:
            return state;
    };
};

export default combineReducers({
    categoryReducer,
});